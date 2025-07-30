import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { headers } from "next/headers";

export class ServerApiService {

  private static BACKEND_SERVER_URL = "http://wangohan_server:3001/api";

  static async get(url: string, getConfig?: AxiosRequestConfig): Promise<AxiosResponse> {
    const h = headers();
    const cookies = (await h).get("cookie");
    return await axios.get(this.BACKEND_SERVER_URL + url, {...getConfig, headers: {
      ...getConfig?.headers,
      Cookie: cookies
    }});
  }

  static async post<T>(url: string, data: T, getConfig?: AxiosRequestConfig): Promise<AxiosResponse> {
    return await axios.post(this.BACKEND_SERVER_URL + url, data, getConfig);
  }
}


export class ServerUtils {
  private static _urls = new Set<string>();

  static registerPreload(url: string) {
    this._urls.add(url);
  }

  static getPreloads() {
    const preloadUrls = Array.from(this._urls);
    return preloadUrls;
  }
}