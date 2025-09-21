import {NextFunction, Request, Response} from 'express';
import {getUserData} from "@/server/utils/server-utils";
import {ApiResponse} from "@/server/utils/ApiUtils";
import {UserLevel} from "@/server/types/user-types";

export class Middleware {
  static async superAdmin (req: Request, res: Response, next: NextFunction){

    const user = getUserData(req);
    if(user === undefined) {
      ApiResponse.unauthorized(res);
      return;
    }

    if(user.user_lvl === UserLevel.super_admin) {
      ApiResponse.forbidden(res, "Unauthorized admin access!");
      return;
    }

    console.log("user here!asd asd ");
    console.log(user);

    next();
  }

  static async admin (req: Request, res: Response, next: NextFunction) {
    const user = getUserData(req);

    if(user === undefined) {
    ApiResponse.unauthorized(res);
    return;
  }

  if(user.user_lvl > UserLevel.admin) {
    ApiResponse.forbidden(res, "Unauthorized admin access!");
    return;
  }

  next();
  }
}