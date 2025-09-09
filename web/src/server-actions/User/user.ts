import {ServerApiResponseService, ServerApiService} from "@/lib/server-utils";
import z from "zod";
import {UserSchema} from "@/types/user-types.user";
import {log} from "@/lib/log";
import {UserDetailSchema} from "@/types/user-types.user-detail";

export const getUser = async (user_id: number, user_codename: string): Promise<z.infer<typeof UserDetailSchema.GetUserDetails> | undefined> => {
  try {
    const response = await ServerApiService.get(`/get-user?user_id=${user_id}&user_codename=${user_codename}`);
    return await ServerApiResponseService.getResponseData<z.infer<typeof UserDetailSchema.GetUserDetails> | undefined>(response);
  } catch(e) {
    log(e);
    return undefined;
  }
}

export const isAuthenticated = async (): Promise<z.infer<typeof UserSchema.User> | undefined> => {
  try {
    const isAuthenticated = await ServerApiService.get("/is-authenticated");
    const responseJson = await ServerApiResponseService.getResponseJson<z.infer<typeof UserSchema.User> | undefined>(isAuthenticated);

    if(responseJson === undefined) {
      log("The response data is undefined!");
      return undefined;
    }

    log(responseJson.message);
    return responseJson.data;
  } catch (e) {
    log(e);
    return undefined;
  }
}