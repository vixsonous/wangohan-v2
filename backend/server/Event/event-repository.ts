
import {log} from "@/server/utils/log";
import {NotificationInsert} from "@/database/types";
import {db} from "@/database/database";

export class EventRepository {

  static async setUserNotificationsRead(user_id: number): Promise<boolean | undefined> {
    try {
      await db.updateTable("notifications_table")
        .set({
          is_read: true
        })
        .where("user_id", "=", user_id)
        .executeTakeFirstOrThrow();

      return true;
    } catch (e) {
      console.error("Error!");
      log(e);
      return undefined;
    }
  }
  static async postNotification(
    user_id: number,
    user_codename: string,
    user_image: string,
    is_read: boolean,
    type: string,
    liked: boolean,
    recipe_id: number,
    recipe_name: string,
    notification_date: Date,
  ) {
    try {

      const newNotification = {
        user_id: user_id,
        user_codename: user_codename,
        user_image: user_image,
        is_read: is_read,
        type: type,
        liked: liked,
        recipe_id: recipe_id,
        recipe_name: recipe_name,
        notification_date: notification_date,
        updated_at: notification_date,
      } satisfies NotificationInsert;

      const notification = await db.insertInto("notifications_table")
        .values(newNotification)
        .onConflict(oc =>
          oc.columns(['user_id', 'recipe_id', 'type'])
            .doUpdateSet({liked: liked, notification_date: notification_date}))
        .executeTakeFirstOrThrow();

      log("Successfully posted notification!");

      return notification;
    } catch (e) {
      console.error("Error!");
      log(e);
      return undefined;
    }
  }
}