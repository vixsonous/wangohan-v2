import { Response } from "express";

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

  static error<T>(res: Response, message?: string, data?:T, status?: number) {
    res.status(status || 500).json({
      message: message || "Unsuccessful!",
      data: data || undefined,
      status: status ?? 500
    } as ResponseData<T>)
  }
  
}