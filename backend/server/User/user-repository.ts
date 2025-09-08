import z from "zod";
import { db } from "@/database/database";
import { log } from "../utils/log";
import { UserLevel} from "../types/user-types";
import {UserDetailInsert, UserDetailUpdate, UserInsert} from "@/database/types";
// @ts-ignore
import bcrypt from 'bcrypt';
import {User} from "./user";
import {ImageProcess} from "@/server/Images/image-service";
import {Image} from "@/server/Images/image";
import {jsonArrayFrom, jsonObjectFrom} from "kysely/helpers/postgres";
import {UserDetailSchema} from "@/server/types/user-types.user-detail";
import {UserAuthenticationSchema} from "@/server/types/user-types.user-authentication";
import {UserSchema} from "@/server/types/user-types.user";

export class UserDetailsRepository {
  private static USER_DETAILS_REPOSITORY_SUCCESS_LOG = {
    GET_USER_SUCCESS: "Successfully retrieved user details data!",
  }

  private static USER_DETAILS_DISPLAY_RECIPES_LIMIT = 9;

  static async getUser(user_id: number, user_codename: string): Promise<z.infer<typeof UserDetailSchema.GetUserDetails> | undefined> {
    try {
      const user: z.infer<typeof UserDetailSchema.GetUserDetails> = await db.selectFrom("user_details_table")
        .select(eb => [
          "user_first_name",
          "user_last_name",
          "user_codename",
          "user_image",
          "user_agreement",
          "user_gender",
          "user_birthdate",
          "user_id",
          "user_occupation",
          jsonArrayFrom(eb.selectFrom("pets_table")
            .select([
              "pets_table.pet_id",
              "pets_table.pet_name",
              "pets_table.pet_breed",
              "pets_table.pet_image",
              "pets_table.pet_birthdate",
              "pets_table.user_id",
              "pets_table.updated_at",
              "pets_table.created_at",
            ]).whereRef("pets_table.user_id", "=", "user_details_table.user_id")
          ).as("pets"),
          jsonArrayFrom(
            eb.selectFrom("likes_table")
              .innerJoin("recipes_table", "recipes_table.recipe_id", "likes_table.recipe_id")
              .select(lteb => [
                "recipes_table.recipe_id",
                "recipes_table.recipe_name",
                lteb.fn.coalesce(
                  lteb.selectFrom("recipe_images_table")
                    .select("recipe_image")
                    .whereRef("recipes_table.recipe_id", "=", "recipe_images_table.recipe_id")
                    .limit(1)
                    ,
                  lteb.val("")
                ).as("recipe_image"),
                "recipes_table.user_id",
                "recipes_table.updated_at",
                "recipes_table.created_at"
              ]).where("likes_table.user_id", "=", user_id)
              .where(eb => eb.and({
                is_liked: true,
                is_deleted: false
              }))
              .limit(UserDetailsRepository.USER_DETAILS_DISPLAY_RECIPES_LIMIT)
          ).as("liked_recipes"),
          jsonArrayFrom(
            eb.selectFrom("recipes_table")
              .select(lteb => [
                "recipes_table.recipe_id",
                "recipes_table.recipe_name",
                lteb.fn.coalesce(
                  lteb.selectFrom("recipe_images_table")
                    .select("recipe_image")
                    .limit(1)
                    .whereRef("recipes_table.recipe_id", "=", "recipe_images_table.recipe_id")
                  ,
                  lteb.val("")
                ).as("recipe_image"),
                "recipes_table.user_id",
                "recipes_table.updated_at",
                "recipes_table.created_at"
              ])
              .where(eb => eb.and({
                user_id: user_id,
                is_deleted: false
              }))
              .limit(UserDetailsRepository.USER_DETAILS_DISPLAY_RECIPES_LIMIT)
          ).as("my_recipes"),
          jsonArrayFrom(
            eb.selectFrom("recipes_table")
              .select(lteb => [
                "recipes_table.recipe_id",
                "recipes_table.recipe_name",
                lteb.fn.coalesce(
                  lteb.selectFrom("recipe_images_table")
                    .select("recipe_image")
                    .limit(1)
                    .whereRef("recipes_table.recipe_id", "=", "recipe_images_table.recipe_id")
                  ,
                  lteb.val("")
                ).as("recipe_image"),
                "recipes_table.user_id",
                "recipes_table.updated_at",
                "recipes_table.created_at"
              ])
              .where(eb => eb.and({
                user_id: user_id,
                is_deleted: true
              }))
              .limit(UserDetailsRepository.USER_DETAILS_DISPLAY_RECIPES_LIMIT)
          ).as("deleted_recipes"),
          eb.fn.coalesce(eb.selectFrom("recipes_table").select(({fn}) => [
            fn.count<number>("recipes_table.user_id").as("total_recipes")
          ]).where("recipes_table.user_id", "=", user_id)
            .where("recipes_table.is_deleted","=", false), eb.val(0)).as("total_recipes"),
          eb.fn.coalesce(eb.selectFrom("recipes_table").select(({fn}) => [
            fn.count<number>("recipes_table.user_id").as("total_recipes")
          ]).where("recipes_table.user_id", "=", user_id)
            .where("recipes_table.is_deleted","=", true), eb.val(0)).as("total_deleted_recipes"),
          eb.fn.coalesce(eb.selectFrom("likes_table").innerJoin("recipes_table", "recipes_table.recipe_id", "likes_table.recipe_id").select(({fn}) => [
            fn.count<number>("likes_table.user_id").as("total_liked")
          ]).where("likes_table.user_id", "=", user_id)
            .where("recipes_table.is_deleted","=", false), eb.val(0)).as("total_liked"),
          "updated_at",
          "created_at"
        ])
        .where(eb => eb.and({
          user_id: user_id,
          user_codename: user_codename
        }))
        .executeTakeFirstOrThrow();

      log(UserDetailsRepository.USER_DETAILS_REPOSITORY_SUCCESS_LOG.GET_USER_SUCCESS);

      return user
    } catch (error) {
      console.error("User not found!");
      log(error);
      return undefined;
    }
  }

  static async postUserDetails(user_detail: z.infer<typeof UserDetailSchema.PostUserDetails>): Promise<z.infer<typeof UserDetailSchema.GetUserDetails> | undefined> {
    try {

      const buffer: Buffer<ArrayBuffer> = Buffer.from(user_detail.user_image.buffer);

      let image = new ImageProcess(buffer.buffer);

      image = image.resize(1024, undefined, {
        withoutEnlargement: true,
        fit: "inside"
      });

      image = image.webp({
        quality: 80
      });

      const uploadImage = await image.result();
      const folder = `${String(user_detail.user_id).padStart(8, "0")}/profile`;
      const uploadDone = await Image.uploadToR2Public(folder, uploadImage, "profile_picture_" + user_detail.user_id, "webp", "images/webp");

      if(uploadDone.Key === undefined) {
        return undefined;
      }

      const newUserDetails: UserDetailInsert = {
        ...user_detail,
        user_image: `r2://${uploadDone.Key}`,
        updated_at: new Date(),
        created_at: new Date()
      };

      const userDetails: z.infer<typeof UserDetailSchema.GetUserDetails> = await db.insertInto("user_details_table")
        .values(newUserDetails)
        .returning([
          "user_id",
          "user_first_name",
          "user_last_name",
          "user_gender",
          "user_occupation",
          "user_image",
          "user_codename",
          "user_agreement",
          "user_birthdate",
        ])
        .executeTakeFirstOrThrow();

      log("Successfully posted user details data!");

      return userDetails;

    } catch (e) {
      log(e);
      return undefined;
    }
  }

  static async updateUserDetails(user_detail: z.infer<typeof UserDetailSchema.UpdateUserDetails>): Promise<z.infer<typeof UserDetailSchema.GetUserDetails> | undefined> {
    try {

      let new_user_image_key = '';
      if(user_detail.user_image) {
        const buffer: Buffer<ArrayBuffer> = Buffer.from(user_detail.user_image.buffer);

        let image = new ImageProcess(buffer.buffer);

        image = image.resize(1024, undefined, {
          withoutEnlargement: true,
          fit: "inside"
        });

        image = image.webp({
          quality: 80
        });

        const uploadImage = await image.result();
        const folder = `${String(user_detail.user_id).padStart(8, "0")}/profile`;
        const uploadDone = await Image.uploadToR2Public(folder, uploadImage, user_detail.user_image.originalname.split(".")[0], "webp", "images/webp");

        if(uploadDone.Key === undefined) {
          return undefined;
        }

        new_user_image_key = uploadDone.Key;
      }

      const updateUserDetails: UserDetailUpdate = {
        user_codename: user_detail.user_codename,
        user_first_name: user_detail.user_first_name,
        user_last_name: user_detail.user_last_name,
        user_gender: user_detail.user_gender,
        user_occupation: user_detail.user_occupation,
        user_agreement: user_detail.user_agreement,
        user_birthdate: user_detail.user_birthdate,
        updated_at: user_detail.updated_at
      }

      if(user_detail.user_image) {
        updateUserDetails.user_image = `r2://${new_user_image_key}`
      }

      const userDetails: z.infer<typeof UserDetailSchema.GetUserDetails> = await db.updateTable("user_details_table")
        .set(updateUserDetails)
        .returning([
          "user_id",
          "user_first_name",
          "user_last_name",
          "user_gender",
          "user_occupation",
          "user_image",
          "user_codename",
          "user_agreement",
          "user_birthdate",
        ])
        .where("user_id", "=", user_detail.user_id)
        .executeTakeFirstOrThrow();

      log("Successfully posted user details data!");
      return userDetails;
    } catch (e) {
      log(e);
      return undefined;
    }
  }
}

export class UserRepository {
  private static USER_REPOSITORY_SUCCESS_MESSAGE = {
    FIND_USER_SUCCESS: "The user exists!",
    CREATE_USER_SUCCESS: "The user is created successfully!",
    GET_USER_BY_ID_SUCCESS: "The user is successfully retrieved!"
  }

  private static USER_REPOSITORY_ERROR_MESSAGE = {
    FIND_USER_ERROR: "The user does not exist!",
    CREATE_USER_ERROR: "There was an error creating the user!",
    GET_USER_BY_ID_ERROR: "Unable to retrieve user!",
  }

  static async getUserById(user_id: number): Promise<z.infer<typeof UserSchema.User> | undefined> {
    try {
      const user = await db.selectFrom("users_table")
        .select(eb => [
          "user_id",
          "email",
          jsonObjectFrom(
            eb.selectFrom("user_details_table")
              .select([
                "user_first_name",
                "user_last_name",
                "user_codename",
                "user_image",
                "user_agreement",
                "user_gender",
                "user_birthdate",
                "user_id",
                "user_occupation",
                "updated_at",
                "created_at"
              ]).whereRef("user_details_table.user_id", "=", "users_table.user_id")
          ).as("user_details"),
          jsonArrayFrom(
            eb.selectFrom("notifications_table")
              .innerJoin("user_details_table", "notifications_table.user_id", "user_details_table.user_id")
              .innerJoin("recipes_table", "recipes_table.recipe_id","notifications_table.recipe_id")
              .select([
                "notifications_table.recipe_id",
                "notifications_table.recipe_name",
                "is_read",
                "type",
                "notifications_table.user_codename",
                "notifications_table.user_image",
                "liked",
                "notifications_table.notification_date"
              ])
              .where("notification_date", ">=", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
              .orderBy("notification_date", "desc")
              .limit(10)
              .whereRef("users_table.user_id", "=", "notifications_table.user_id")
          ).as("notifications")
        ])
        .where("user_id", "=", user_id)
        .executeTakeFirstOrThrow() as z.infer<typeof UserSchema.User>;

      log(UserRepository.USER_REPOSITORY_SUCCESS_MESSAGE.GET_USER_BY_ID_SUCCESS);

      return user
    } catch (error) {
      console.error("User not found!");
      log(error);
      return undefined;
    }
  }

  static async getUserByGoogleId(google_id: string): Promise<z.infer<typeof UserSchema.User> | undefined> {
    try {
      const user = await db.selectFrom("users_table")
        .select(eb => [
          "user_id",
          "email",
          jsonObjectFrom(
            eb.selectFrom("user_details_table")
              .select([
                "user_first_name",
                "user_last_name",
                "user_codename",
                "user_image",
                "user_agreement",
                "user_gender",
                "user_birthdate",
                "user_id",
                "user_occupation",
                "updated_at",
                "created_at"
              ]).whereRef("user_details_table.user_id", "=", "users_table.user_id")
          ).as("user_details"),
          jsonArrayFrom(
            eb.selectFrom("notifications_table")
              .innerJoin("user_details_table", "notifications_table.user_id", "user_details_table.user_id")
              .innerJoin("recipes_table", "recipes_table.recipe_id","notifications_table.recipe_id")
              .select([
                "notifications_table.recipe_id",
                "notifications_table.recipe_name",
                "is_read",
                "type",
                "notifications_table.user_codename",
                "notifications_table.user_image",
                "liked",
                "notifications_table.updated_at as notification_date"
              ])
              .where("notification_date", ">=", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
              .orderBy("notification_date", "desc")
              .limit(10)
              .whereRef("users_table.user_id", "=", "notifications_table.user_id")
          ).as("notifications")
        ])
        .where("google_id", "=", google_id)
        .executeTakeFirstOrThrow() as z.infer<typeof UserSchema.User>;

      log(UserRepository.USER_REPOSITORY_SUCCESS_MESSAGE.GET_USER_BY_ID_SUCCESS);

      return user
    } catch (error) {
      console.error("User not found!");
      log(error);
      return undefined;
    }
  }

  static async findUser({user_email, google_id, user_id}:{user_email?: string | undefined, google_id?: string | undefined, user_id?: string | undefined}): Promise<z.infer<typeof UserAuthenticationSchema.UserCredentials> | undefined> {
    try {
      const user: z.infer<typeof UserAuthenticationSchema.UserCredentials> = await db.selectFrom("users_table")
        .select([
          "user_id",
          "email",
          "google_id",
          "password"
        ])
        .$if(user_email !== undefined, q => q.where("email","=", user_email!))
        .$if(google_id !== undefined, q => q.where("google_id","=",google_id!))
        .$if(user_id !== undefined, q => q.where("user_id","=",Number(user_id!)))
        .executeTakeFirstOrThrow();

      log(UserRepository.USER_REPOSITORY_SUCCESS_MESSAGE.FIND_USER_SUCCESS);
      return user
    } catch (error) {
      console.error(UserRepository.USER_REPOSITORY_ERROR_MESSAGE.FIND_USER_ERROR);
      log(error);
      return undefined;
    }
  }

  static async createUser(user: z.infer<typeof UserAuthenticationSchema.UserCredentials>): Promise<User | undefined> {
    try {
      let password = '';

      if(user.password !== undefined && user.password !== '') {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(user.password, salt);
      }

      const newUser = {
        email: user.email,
        google_id: user.google_id || "",
        password: password,
        user_lvl: UserLevel.user,
        is_inactive: false,
        updated_at: new Date(),
        created_at: new Date(),
      } satisfies UserInsert;

      const createdUser = await db.insertInto("users_table")
        .values(newUser)
        .returning([
          "email",
          "user_id",
          "google_id",
          "created_at",
          "updated_at"
        ])
        .executeTakeFirstOrThrow();
      
      const userInstance = new User(createdUser);

      log(UserRepository.USER_REPOSITORY_SUCCESS_MESSAGE.CREATE_USER_SUCCESS);
      return userInstance;
    } catch (error) {
      console.error(UserRepository.USER_REPOSITORY_ERROR_MESSAGE.CREATE_USER_ERROR);
      log(error);

      return undefined;
    }
  }
}