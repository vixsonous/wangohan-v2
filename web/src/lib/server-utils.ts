import {headers} from "next/headers";

export class ServerApiResponseService {
  static async getResponseData<T>(res: Response): Promise<T>{
    const responseData = await res.json();
    return responseData.data as T;
  }

  static async getResponseJson<T>(res: Response): Promise<{message: string, data: T} | undefined> {
    try {
      return await res.json();
    } catch(e) {
      console.error(e);
      return undefined
    }

  }
}
export class ServerApiService {

  private static BACKEND_SERVER_URL = "http://wangohan_server:3001/api";

  static async get(url: string, getConfig?: RequestInit): Promise<Response> {
    const h = headers();
    const cookies = (await h).get("cookie") || "";

    return await fetch(this.BACKEND_SERVER_URL + url, {
      method: "GET",
      headers: {
        'Cookie': cookies
      },
      credentials: "include",
      ...getConfig
    })
  }
}


export class ServerUtils {
  private static _urls = new Set<string>();

  static registerPreload(url: string) {
    this._urls.add(url);
  }

  static getPreloads() {
    return Array.from(this._urls);
  }
}