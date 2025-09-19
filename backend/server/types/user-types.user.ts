import z from "zod";
import {UserDetailSchema} from "@/server/types/user-types.user-detail";
import {EventSchema} from "@/server/types/event-types";

export class UserSchema {
  public static UserDisplay = z.object({
    user_id: z.number(),
    user_codename: z.string(),
    user_image: z.string(),
  }).nullable();

  public static User = z.object({
    user_id: z.number(),
    email: z.email(),
    user_lvl: z.number(),
    user_details: UserDetailSchema.GetUserDetails.nullable(),
    notifications: z.array(EventSchema.Event)
  });

}