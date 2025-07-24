import { Request, Response } from "express";
import { UserService } from "./user-service";
import { ApiResponse } from "../utils/ApiUtils";
import { log } from "../utils/log";

export class UserController {
  static async getUser(req: Request, res: Response) {
    const {user_id, user_codename} = req.query;
    const user = await UserService.getUser(Number(user_id), String(user_codename));
    
    if(user === undefined) {
      ApiResponse.error(res, "User not found!", user);
      return;
    }
    log("Successfully retrieved user data!");
    ApiResponse.success(res, "User found!", user);
  }

  static async login(req: Request, res: Response) {
    console.log("logined!");
    const d = await UserService.localStrategyLogin("wqe", "qwe");
    ApiResponse.success(res, "Successfully logged in!");
  }
}