import { User, UserDetails } from "./user";
import {UserAuthenticationSchema} from "@/server/types/user-types";
import z from "zod";
import {log} from "@/server/utils/log";

export class UserService {
  static USER_SERVICE_SUCCESS_LOGS = {
    GET_USER_SUCCESS: "Successfully retrieved user details!",
    LOCAL_STRATEGY_LOGIN_SUCCESS: "Successfully found user!",
    LOCAL_STRATEGY_REGISTER_SUCCESS: "Successfully created a new user!"
  }
  static async getUser(user_id: number, user_codename: string) {
    const user = await UserDetails.getUser(user_id, user_codename);
    log(UserService.USER_SERVICE_SUCCESS_LOGS.GET_USER_SUCCESS);
    return user;
  }

  static async localStrategyLogin(email: string, password: string): Promise<z.infer<typeof UserAuthenticationSchema.UserCredentials> | undefined> {
    const user = await User.findUser({email});
    log(UserService.USER_SERVICE_SUCCESS_LOGS.LOCAL_STRATEGY_LOGIN_SUCCESS);
    return user;
  }

  static async localStrategyRegister(email: string, password: string): Promise<User | undefined> {
    const createResult = await new User({email, password}).createUser();
    log(UserService.USER_SERVICE_SUCCESS_LOGS.LOCAL_STRATEGY_REGISTER_SUCCESS);
    return createResult;
  }
}