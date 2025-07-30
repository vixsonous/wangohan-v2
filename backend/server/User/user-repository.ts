import z from "zod";
import { db } from "../../database/database";
import { log } from "../utils/log";
import { UserCredentials, UserDetailsData, UserLevel } from "./user-types";
import { UserCredentialsSchema } from "./user-schema";
import { UserInsert } from "../../database/types";
import bcrypt from 'bcrypt';
import { User } from "./user";

export class UserDetailsRepository {
  static async getUser(user_id: number, user_codename: string): Promise<UserDetailsData | undefined> {
    try {
      const user: UserDetailsData = await db.selectFrom("user_details_table")
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

      return user
    } catch (error) {
      console.error("User not found!");
      log(error);
      return undefined;
    }
  }
}

export class UserRepository {
  static async findUser({user_email, google_id, user_id}:{user_email?: string | undefined, google_id?: string | undefined, user_id?: string | undefined}): Promise<UserCredentials | undefined> {
    try {
      const user: UserCredentials = await db.selectFrom("users_table")
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

      return user
    } catch (error) {
      console.error("User not found!");
      log(error);
      return undefined;
    }
  }

  static async createUser(user: z.infer<typeof UserCredentialsSchema>): Promise<User | undefined> {
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

      return userInstance;
    } catch (error) {
      console.error("Error creating user!");
      log(error);

      return undefined;
    }
  }
}