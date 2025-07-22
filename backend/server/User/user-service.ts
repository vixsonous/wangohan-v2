import { User } from "./user";

export class UserService {
  static async getUser(user_id: number, user_codename: string) {
    const user = await User.getUser(user_id, user_codename);

    return user;
  }
}