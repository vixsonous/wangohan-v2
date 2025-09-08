import { Response } from "express";
import {log} from "@/server/utils/log";

export interface ResponseData<T> {
  message: string;
  data: T;
  status: number;
}

export class ApiResponse {
  static success<T>(res: Response, message?: string, data?:T, status?: number) {
    res.status(status || 200).json({
      message: message || "Success!",
      data: data || undefined,
      status: status ?? 200
    } as ResponseData<T>)
  }

  static redirect(res: Response, url: string) {
    res.status(302).redirect(url);
  }

  static error<T>(res: Response, message?: any, data?:T, status?: number) {
    console.error("Error!");
    log(message);
    res.status(status || 500).json({
      message: message || "Unsuccessful!",
      data: data || undefined,
      status: status ?? 500
    } as ResponseData<T>)
  }

  static unauthorized<T>(res: Response, message?: string) {
    res.status(401).json({
      message: message || "Unauthorized!",
      data: undefined,
      status: 401
    } as ResponseData<T>)
  }
  
}

export class ApiTest {
  static async success(response: Response) {
    return new Promise((res) => {
      setTimeout(() => {
        res("Test success!");
        response.status(200).json({message: "Test Success!"});
        return;
      }, 2000);
    });

  }

  static async error(response: Response) {
    return new Promise((res) => {
      setTimeout(() => {
        res("Test error!");
        response.status(500).json({message: "Test error!"});
        return;
      }, 2000);
    });

  }
}