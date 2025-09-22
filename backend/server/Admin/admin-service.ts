import {AdminRepository} from "@/server/Admin/admin-repository";
import {AdminControllerSchema} from "@/server/Admin/admin-controller";
import z from "zod";

export class AdminService {
  static getAdminData() {
    return AdminRepository.getAdminData();
  }

  static publishRecipe(data: z.infer<typeof AdminControllerSchema.PublishRecipe>) {
    return AdminRepository.publishRecipe(data);
  }
}