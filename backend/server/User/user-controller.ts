import { Request, Response } from "express";
import { UserService } from "./user-service";
import { ApiResponse } from "../utils/ApiUtils";
import { log } from "../utils/log";
import { UserLocalStrategyRegistrationSchema } from "./user-schema";
import z from "zod";
import { User } from "./user";

export class UserController {
  static async getUser(req: Request, res: Response) {
    console.log(req.user);
    const {user_id, user_codename} = req.query;
    const user = await UserService.getUser(Number(user_id), String(user_codename));
    
    if(user === undefined) {
      ApiResponse.error(res, "User not found!", user);
      return;
    }
    log("Successfully retrieved user data!");
    ApiResponse.success(res, "User found!", user);
  }

  static async isAuthenticated(req: Request, res: Response) {
    ApiResponse.success(res, req.user ? "Authenticated": "Not authenticated", req.user, 200);
  }

  static async login(req: Request, res: Response) {
    console.log(req.user);
    ApiResponse.success(res, "Successfully logged in!");
  }

  static async register(req: Request, res: Response) {
    const data: z.infer<typeof UserLocalStrategyRegistrationSchema> = req.body;
    
    const result = UserLocalStrategyRegistrationSchema.safeParse(data);

    if(result.success === false) {
      ApiResponse.error(res, result.error.errors[0].message);
      return;
    }

    const userExist = await User.findUser({email: data.email});

    if(userExist) {
      ApiResponse.error(res, "User already exists!");
      return;
    }

    const createResult = await UserService.localStrategyRegister(data.email, data.password);

    if(!createResult) {
      ApiResponse.error(res, "Failed to create user!");
      return;
    }

    req.logIn(createResult.getId(), (err) => {
      if(err) {
        ApiResponse.error(res, "Error in saving to session!");
      }
    });

    ApiResponse.success(res, "Successfully registered!");
  }
}