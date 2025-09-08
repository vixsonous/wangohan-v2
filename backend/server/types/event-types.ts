import z from "zod";

export class EventSchema {
  static Event = z.object({
    type: z.enum(["like", "comment", "unlike"], "Invalid event type!"),
    recipe_id: z.number("Please provide the recipe id!"),
    recipe_name: z.string().min(1, "Please provide the recipe name!"),
    user_codename: z.string().min(1, "Please provide the user codename!"),
    user_image: z.string().min(1, "Please provide the user image!"),
    is_read: z.boolean("Please provide if the user read the notification!")
  })
}