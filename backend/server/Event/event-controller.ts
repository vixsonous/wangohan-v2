import {Request, Response} from "express";
import {getUserData} from "@/server/utils/server-utils";
import {ApiResponse} from "@/server/utils/ApiUtils";
import {EventService} from "@/server/Event/event-service";
import {EventMessageError, EventMessageSuccess} from "@/server/Event/event-messages";
import z from "zod";

export class EventControllerSchema {
  static ReadNotification = z.object({
    notification_id: z.number("Please provide the notification id!")
  })
}
export class EventController {
  static async readNotification(req: Request, res: Response): Promise<void> {
    const notification_id = req.params.notification_id;

    const readNotificationParseResult = EventControllerSchema.ReadNotification.safeParse({
      notification_id: Number(notification_id),
    });

    if(!readNotificationParseResult.success) {
      ApiResponse.error(res, readNotificationParseResult.error.issues[0].message);
      return;
    }

    const result = await EventService.readNotification(readNotificationParseResult.data.notification_id);

    if(!result) {
      ApiResponse.error(res, "There was an error reading the notification!");
      return;
    }

    ApiResponse.success(res, "Successfully read notification!", {id: readNotificationParseResult.data.notification_id});
  }
  static async setUserNotificationsRead(req: Request, res: Response) {
    const user = getUserData(req);

    if(!user) {
      ApiResponse.unauthorized(res, "Unauthorized!");
      return;
    }

    const result = await EventService.setUserNotificationsRead(user.user_id);

    if(!result) {
      ApiResponse.error(res, EventMessageSuccess.SETTING_NOTIFICATION);
      return;
    }

    ApiResponse.success(res, EventMessageError.SETTING_NOTIFICATION);
  }
}