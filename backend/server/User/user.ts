import { UserRepository } from "./user-repository";
import { UserCredentials, UserData, UserDisplay } from "./user-types";

export class User {
  private user_first_name: string;
  private user_last_name: string;
  private user_codename: string;
  private user_image: string;
  private user_agreement: number;
  private user_gender: string;
  private user_birthdate: Date;
  private user_id: number;
  private user_occupation: string;
  private updated_at: Date;
  private created_at: Date;
  constructor(
    user: UserData
  ) {
    this.user_first_name = user.user_first_name; 
    this.user_last_name  = user.user_last_name ;
    this.user_codename  = user.user_codename ;
    this.user_image = user.user_image;
    this.user_agreement  = user.user_agreement ;
    this.user_gender = user.user_gender;
    this.user_birthdate = user.user_birthdate;
    this.user_id = user.user_id;
    this.user_occupation = user.user_occupation; 
    this.updated_at = user.updated_at;
    this.created_at = user.created_at;
  }

  getDisplayUser(): UserDisplay {
    return {
      user_id: this.user_id,
      user_codename: this.user_codename,
      user_image: this.user_image
    }
  }

  static async getUser(user_id: number, user_codename: string): Promise<User | undefined> {
    const user = await UserRepository.getUser(user_id, user_codename);

    return user ? new User(user) : user;
  }

  static async findUser({email, googleId}: {email?: string | undefined, googleId?: string | undefined}): Promise<UserCredentials | undefined> {
    const user = await UserRepository.findUser({user_email: email, google_id: googleId});

    return user;
  }
}