import {NextFunction, Request, Response} from "express";
import { UserService } from "./user-service";
import {ApiResponse} from "../utils/ApiUtils";
import { log } from "../utils/log";
import z from "zod";
import { User } from "./user";
import {UserAuthenticationSchema} from "@/server/types/user-types.user-authentication";
import {UserDetailSchema} from "@/server/types/user-types.user-detail";
import passport from "@/server/utils/passport";

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

  static async isAuthenticated(req: Request, res: Response) {
    console.log("the cookies here " + req.cookies);
    ApiResponse.success(res, req.user ? "Authenticated": "Not authenticated", req.user, 200);
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', (err: any, user: any, info: any) => {
      if(err) {
        ApiResponse.error(res, err);
        return;
      }

      log(info);

      req.logIn(user, (loginError) => {
        if(loginError){
          ApiResponse.error(res, loginError);
          return;
        }

        ApiResponse.success(res, "Successfully logged in!");
      })


    })(req, res, next);

  }

  static async register(req: Request, res: Response) {
    const data: z.infer<typeof UserAuthenticationSchema.UserLocalStrategyRegistration> = req.body;
    
    const result = UserAuthenticationSchema.UserLocalStrategyRegistration.safeParse(data);

    if(!result.success) {
      ApiResponse.error(res, result.error.issues[0].message);
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
        return;
      }

      ApiResponse.success(res, "Successfully registered!");
    });


  }

  static async registerPersonalInfo(req: Request, res: Response) {
    const submitData = {
      ...req.body,
      user_id: Number(req.body.user_id),
      user_agreement: Number(req.body.user_agreement),
      user_birthdate: new Date(req.body.user_birthdate),
      user_image: req.file,
      updated_at: new Date(req.body.updated_at),
      created_at: new Date(req.body.created_at),
    };

    const personalInfoData = UserDetailSchema.PostUserDetails.safeParse(submitData);

    if(!personalInfoData.success) {
      ApiResponse.error(res, "Invalid personal information data!");
      return;
    }

    const userDetail = await UserService.postPersonalInfo(personalInfoData.data);

    if(userDetail === undefined) {
      ApiResponse.error(res, "Error in saving personal information!");
      return;
    }

    const userData = userDetail.getDisplayUser();

    if(userData === null) {
      ApiResponse.error(res, "Error in saving personal information!");
      return;
    }

    ApiResponse.success(res, "Successfully registered personal info!", userData);
  }

  static async logout(req: Request, res: Response) {
    if(req.user === undefined) {
      ApiResponse.error(res, "Unauthorized log out!");
      return;
    }

    req.logOut(err => {
      if(err) {
        ApiResponse.error(res, "Error logging out!");
        return;
      }

      ApiResponse.success(res, "Successfully logged out!");
    })
  }
}