import z from "zod";
import { db } from "@/database/database";
import { log } from "../utils/log";
import {UserAuthenticationSchema, UserDetailSchema, UserLevel} from "../types/user-types";
import {UserDetailInsert, UserInsert} from "@/database/types";
// @ts-ignore
import bcrypt from 'bcrypt';
import {User} from "./user";
import {ImageProcess} from "@/server/Images/image-service";
import {Image} from "@/server/Images/image";

export class UserDetailsRepository {
  private static USER_DETAILS_REPOSITORY_SUCCESS_LOG = {
    GET_USER_SUCCESS: "Successfully retrieved user details data!",
  }
  static async getUser(user_id: number, user_codename: string): Promise<z.infer<typeof UserDetailSchema.GetUserDetails> | undefined> {
    try {
      const user: z.infer<typeof UserDetailSchema.GetUserDetails> = await db.selectFrom("user_details_table")
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
      const uploadDone = await Image.uploadToR2Public(folder, uploadImage, user_detail.user_image.originalname.split(".")[0], "webp", "images/webp");

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
}

export class UserRepository {
  private static USER_REPOSITORY_SUCCESS_MESSAGE = {
    FIND_USER_SUCCESS: "The user exists!",
    CREATE_USER_SUCCESS: "The user is created successfully!"
  }

  private static USER_REPOSITORY_ERROR_MESSAGE = {
    FIND_USER_ERROR: "The user does not exist!",
    CREATE_USER_ERROR: "There was an error creating the user!"
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