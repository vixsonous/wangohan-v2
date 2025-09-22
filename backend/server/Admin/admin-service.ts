import {AdminRepository} from "@/server/Admin/admin-repository";

export class AdminService {
  static getAdminData() {
    return AdminRepository.getAdminData();
  }
}