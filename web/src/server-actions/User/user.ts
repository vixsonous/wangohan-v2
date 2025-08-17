import { ServerApiService } from "@/lib/server-utils";
import { UserData } from "./user-types";
import z from "zod";
import {UserSchema} from "@/types/user-types.user";
import {log} from "@/lib/log";

export const getUser = async (user_id: number, user_codename: string): Promise<UserData | undefined> => {
  try {
    const {data} = await ServerApiService.get(`/get-user?user_id=${user_id}&user_codename=${user_codename}`);
    return data.data;
  } catch(e) {
    console.log(e);
    return undefined;
  }
}

export const isAuthenticated = async (): Promise<z.infer<typeof UserSchema.User> | undefined> => {
  try {
    const isAuthenticated = await ServerApiService.get("/is-authenticated");
    log(isAuthenticated.data.message);
    return isAuthenticated.data.data;
  } catch (e) {
    log(e);
    return undefined;
  }
}