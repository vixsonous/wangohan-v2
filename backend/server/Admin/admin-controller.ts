import {Request, Response} from 'express';
import {ApiResponse} from "@/server/utils/ApiUtils";
import {AdminService} from "@/server/Admin/admin-service";

export class AdminController {
  static async getAdminData(req: Request, res: Response) {

    const data = await AdminService.getAdminData();

    ApiResponse.success(res, "Successfully retrieved admin data!", data);
  }
}