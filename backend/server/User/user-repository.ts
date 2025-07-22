import { db } from "../../database/database";
import { log } from "../utils/log";
import { UserData } from "./user-types";

export class UserRepository {
  static async getUser(user_id: number, user_codename: string): Promise<UserData | undefined> {
    try {
      const user: UserData = await db.selectFrom("user_details_table")
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