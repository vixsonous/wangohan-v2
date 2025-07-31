import { User, UserDetails } from "./user";
import { UserCredentials } from "./user-types";

export class UserService {
  static async getUser(user_id: number, user_codename: string) {
    const user = await UserDetails.getUser(user_id, user_codename);

    return user;
  }

  static async localStrategyLogin(email: string, password: string): Promise<UserCredentials | undefined> {
    const user = await User.findUser({email});
    
    return user;
  }

  static async localStrategyRegister(email: string, password: string): Promise<User | undefined> {
    const createResult = await new User({email, password}).createUser();

    return createResult;
  }
}