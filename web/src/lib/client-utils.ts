"use client";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export class ClientApiService {

  private static BACKEND_SERVER_URL = process.env.NEXT_PUBLIC_ORIGIN + "/api";

  static async get(url: string, getConfig?: AxiosRequestConfig): Promise<AxiosResponse> {
    return await axios.get(this.BACKEND_SERVER_URL + url, {...getConfig, withCredentials: true});
  }

  static async post<T>(url: string, data: T, getConfig?: AxiosRequestConfig): Promise<AxiosResponse> {
    return await axios.post(this.BACKEND_SERVER_URL + url, data, {...getConfig, withCredentials: true});
  }
}

export class ClientApiResponseService {
  static getAxiosResponseMessage(response: AxiosResponse): string {
    return response.data.message;
  }
}