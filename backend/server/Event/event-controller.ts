import {Request, Response} from "express";
import {getUserData} from "@/server/utils/server-utils";
import {log} from "@/server/utils/log";
import {ApiResponse} from "@/server/utils/ApiUtils";
import {EventService} from "@/server/Event/event-service";

export class EventController {
  static async setUserNotificationsRead(req: Request, res: Response) {
    const user = getUserData(req);

    if(!user) {
      log("Unauthorized!");
      ApiResponse.unauthorized(res);
      return;
    }

    const result = await EventService.setUserNotificationsRead(user.user_id);

    if(!result) {
      console.error("There was an error setting notifications as read!");
      ApiResponse.error(res, "There was an error setting notifications as read!");
      return;
    }

    ApiResponse.success(res, "Successfully read all notifications!");
  }
}