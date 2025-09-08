import {EventRepository} from "@/server/Event/event-repository";

export class EventService {

  static async setUserNotificationsRead(user_id: number) {
    return await EventRepository.setUserNotificationsRead(user_id);
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
    return await EventRepository.postNotification(
      user_id,
      user_codename,
      user_image,
      is_read,
      type,
      liked,
      recipe_id,
      recipe_name,
      notification_date
    );
  }
}