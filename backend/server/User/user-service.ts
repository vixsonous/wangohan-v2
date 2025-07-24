import { User } from "./user";

export class UserService {
  static async getUser(user_id: number, user_codename: string) {
    const user = await User.getUser(user_id, user_codename);

    return user;
  }

  static async localStrategyLogin(email: string, password: string) {
    const user = await User.findUser({email});
    console.log(user);
  }
}