import { ServerApiService } from "@/lib/server-utils";
import { UserData } from "./user-types";

export const getUser = async (user_id: number, user_codename: string): Promise<UserData | undefined> => {
  try {
    const {data} = await ServerApiService.get(`/get-user?user_id=${user_id}&user_codename=${user_codename}`);
    return data.data;
  } catch(e) {
    console.log(e);
    return undefined;
  }
}