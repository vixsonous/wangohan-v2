import {GetUserDetails, PostUserDetails, UpdateUserDetails, User} from "./user";
import z from "zod";
import {log} from "@/server/utils/log";
import {UserAuthenticationSchema} from "@/server/types/user-types.user-authentication";
import {UserDetailSchema} from "@/server/types/user-types.user-detail";

export class UserService {
  static USER_SERVICE_SUCCESS_LOGS = {
    GET_USER_SUCCESS: "Successfully retrieved user details!",
    LOCAL_STRATEGY_LOGIN_SUCCESS: "Successfully found user!",
    LOCAL_STRATEGY_REGISTER_SUCCESS: "Successfully created a new user!",
    POST_USER_DETAILS_SUCCESS: "Successfully posted personal information!",
    UPDATE_USER_DETAILS_SUCCESS: "Successfully updated personal information!",
  }
  static async getUser(user_id: number, user_codename: string): Promise<GetUserDetails | undefined> {
    const user = await GetUserDetails.getUser(user_id, user_codename);
    log(UserService.USER_SERVICE_SUCCESS_LOGS.GET_USER_SUCCESS);
    return user;
  }

  static async localStrategyLogin(email: string): Promise<z.infer<typeof UserAuthenticationSchema.UserCredentials> | undefined> {
    const user = await User.findUser({email});

    if(user !== undefined) log(UserService.USER_SERVICE_SUCCESS_LOGS.LOCAL_STRATEGY_LOGIN_SUCCESS);

    return user;
  }

  static async localStrategyRegister(email: string, password: string): Promise<User | undefined> {
    const createResult = await new User({email, password}).createUser();
    log(UserService.USER_SERVICE_SUCCESS_LOGS.LOCAL_STRATEGY_REGISTER_SUCCESS);
    return createResult;
  }

  static async postPersonalInfo(personal_info: z.infer<typeof UserDetailSchema.PostUserDetails>) {
    const createResult = await new PostUserDetails(personal_info).create();
    log(UserService.USER_SERVICE_SUCCESS_LOGS.POST_USER_DETAILS_SUCCESS);
    return createResult;
  }

  static async updatePersonalInfo(personal_info: z.infer<typeof UserDetailSchema.UpdateUserDetails>) {
    const updateResult = await new UpdateUserDetails(personal_info).update();
    log(UserService.USER_SERVICE_SUCCESS_LOGS.UPDATE_USER_DETAILS_SUCCESS);
    return updateResult;
  }
}