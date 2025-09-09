import {Request, Response} from "express";
import {getUserData} from "@/server/utils/server-utils";
import {ApiResponse} from "@/server/utils/ApiUtils";
import {EventService} from "@/server/Event/event-service";
import {EventMessageError, EventMessageSuccess} from "@/server/Event/event-messages";

export class EventController {
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