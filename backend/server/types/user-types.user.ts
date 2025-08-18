import z from "zod";
import {UserDetailSchema} from "@/server/types/user-types.user-detail";

export class UserSchema {
  public static UserDisplay = z.object({
    user_id: z.number(),
    user_codename: z.string(),
    user_image: z.string(),
  }).nullable();

  public static User = z.object({
    user_id: z.number(),
    email: z.email(),
    user_details: UserDetailSchema.GetUserDetails.nullable()
  });

}