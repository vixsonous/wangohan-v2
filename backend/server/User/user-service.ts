import {GetUserDetails, PostUserDetails, UpdateUserDetails, User} from "./user";
import z from "zod";
import {log} from "@/server/utils/log";
import {UserAuthenticationSchema} from "@/server/types/user-types.user-authentication";
import {UserDetailSchema} from "@/server/types/user-types.user-detail";
import {db} from "@/database/database";
import {ImageService} from "@/server/Images/image-service";
import {FolderNameUtils, ImageKeyUtils} from "@/server/utils/string-utils";
import {UserDetailUpdate} from "@/database/types";
import {UserDetailsRepository} from "@/server/User/user-repository";

export class UserService {
  static USER_SERVICE_SUCCESS_LOGS = {
    GET_USER_SUCCESS: "Successfully retrieved user details!",
    LOCAL_STRATEGY_LOGIN_SUCCESS: "Successfully found user!",
    LOCAL_STRATEGY_REGISTER_SUCCESS: "Successfully created a new user!",
    POST_USER_DETAILS_SUCCESS: "Successfully posted personal information!",
    UPDATE_USER_DETAILS_SUCCESS: "Successfully updated personal information!",
    GOOGLE_STRATEGY_LOGIN_SUCCESS: "Successfully found user!",
    GOOGLE_STRATEGY_REGISTER_SUCCESS: "Successfully created a new user!",
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

  static async googleStrategyLogin(google_id: string): Promise<z.infer<typeof UserAuthenticationSchema.UserCredentials> | undefined> {
    const user = await User.findUser({googleId: google_id});

    if(user !== undefined) log(UserService.USER_SERVICE_SUCCESS_LOGS.GOOGLE_STRATEGY_LOGIN_SUCCESS);
    return user;
  }

  static async localStrategyRegister(email: string, password: string): Promise<User | undefined> {
    const createResult = await new User({email, password}).createUser();
    log(UserService.USER_SERVICE_SUCCESS_LOGS.LOCAL_STRATEGY_REGISTER_SUCCESS);
    return createResult;
  }

  static async googleStrategyRegister(email: string, google_id: string): Promise<User | undefined> {
    const createResult = await new User({email, google_id}).createUser();
    log(UserService.USER_SERVICE_SUCCESS_LOGS.GOOGLE_STRATEGY_REGISTER_SUCCESS);
    return createResult;
  }

  static async postPersonalInfo(personal_info: z.infer<typeof UserDetailSchema.PostUserDetails>) {
    const createResult = await new PostUserDetails(personal_info).create();
    log(UserService.USER_SERVICE_SUCCESS_LOGS.POST_USER_DETAILS_SUCCESS);
    return createResult;
  }

  static async updatePersonalInfo(personal_info: z.infer<typeof UserDetailSchema.UpdateUserDetails>) {
    return await db.transaction().execute(async trx => {
      let new_user_image_key = '';
      try {
        if(personal_info.user_image) {
          const uploadImage = await ImageService.getProcessedImageBuffer({
            fileBuffer: personal_info.user_image.buffer,
            quality: 80,
            width: 1024,
            fit: "inside"
          });

          const folder = FolderNameUtils.profileFolder(personal_info.user_id);
          new_user_image_key = await ImageService.uploadToR2Public(folder, uploadImage, ImageService.getFileName(personal_info.user_image), "webp", "images/webp");
        }

        const updateUserDetails: UserDetailUpdate = {
          user_codename: personal_info.user_codename,
          user_first_name: personal_info.user_first_name,
          user_last_name: personal_info.user_last_name,
          user_gender: personal_info.user_gender,
          user_occupation: personal_info.user_occupation,
          user_agreement: personal_info.user_agreement,
          user_birthdate: personal_info.user_birthdate,
          updated_at: personal_info.updated_at
        }

        if(personal_info.user_image) {
          updateUserDetails.user_image = ImageKeyUtils.generateR2Key(new_user_image_key);
        }

        return await UserDetailsRepository.updateUserDetails(updateUserDetails, trx);
      } catch (error) {
        if(new_user_image_key !== '') {
          await ImageService.deleteR2Public(new_user_image_key);
        }

        throw error;
      }
    });
  }
}