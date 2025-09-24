import {AdminRepository} from "@/server/Admin/admin-repository";
import {AdminControllerSchema} from "@/server/Admin/admin-controller";
import z from "zod";

export class AdminService {
  static async getAdminData() {
    return AdminRepository.getAdminData();
  }

  static async publishRecipe(data: z.infer<typeof AdminControllerSchema.PublishRecipe>) {
    return AdminRepository.publishRecipe(data);
  }

  static async deleteRecipe(data: z.infer<typeof AdminControllerSchema.DeleteRecipe>) {
    await AdminRepository.deleteRecipeImages(data);
    return AdminRepository.deleteRecipe(data);
  }

  static async publishBlog(data: z.infer<typeof AdminControllerSchema.PublishBlog>) {
    return AdminRepository.publishBlog(data);
  }

  static async deleteBlog(data: z.infer<typeof AdminControllerSchema.DeleteBlog>) {
    return AdminRepository.deleteBlog(data);
  }

  static async updateUserLevel(data: z.infer<typeof AdminControllerSchema.UpdateUserLevel>) {
    return AdminRepository.updateUserLevel(data);
  }
}