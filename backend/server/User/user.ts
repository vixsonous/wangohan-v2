import z from "zod";
import { UserDetailsRepository, UserRepository } from "./user-repository";
import {UserAuthenticationSchema, UserDetailSchema, UserSchema} from "../types/user-types";

export class User {
  
  private user_id?: number;
  private google_id?: string;
  private email: string;
  private password?: string;
  private user_lvl?: number;
  private updated_at?: Date;
  private created_at?: Date;
  
  constructor(user: z.infer<typeof UserAuthenticationSchema.User>) {
    this.user_id = user.user_id;
    this.google_id = user.google_id;
    this.email = user.email;
    this.password = user.password;
    this.user_lvl = user.user_lvl;
    this.updated_at = user.updated_at;
    this.created_at = user.created_at;
  }
  
  static async findUser({email, googleId}: {email?: string | undefined, googleId?: string | undefined}): Promise<z.infer<typeof UserAuthenticationSchema.UserCredentials> | undefined> {
    const user = await UserRepository.findUser({user_email: email, google_id: googleId});

    return user;
  }

  async createUser(): Promise<User | undefined> {
    const createResult = await UserRepository.createUser({email: this.email, google_id: this.google_id, password: this.password});

    return createResult;
  }

  getId(): number {
    return this.user_id || -1;
  }
}
export class UserDetails {
  private user_first_name: string;
  private user_last_name: string;
  private user_codename: string;
  private user_image: string;
  private user_agreement: number;
  private user_gender: string;
  private user_birthdate: Date;
  private user_id: number;
  private user_occupation: string;
  private updated_at: Date | undefined;
  private created_at: Date | undefined;
  constructor(
    user: z.infer<typeof UserDetailSchema.UserDetails>
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

  getDisplayUser(): z.infer<typeof UserSchema.UserDisplay> {
    return {
      user_id: this.user_id,
      user_codename: this.user_codename,
      user_image: this.user_image
    }
  }

  static async getUser(user_id: number, user_codename: string): Promise<UserDetails | undefined> {
    const user: z.infer<typeof UserDetailSchema.UserDetails> | undefined = await UserDetailsRepository.getUser(user_id, user_codename);

    return user ? new UserDetails(user) : user;
  }

  async create() {
    const userDetail: z.infer<typeof UserDetailSchema.UserDetails> | undefined= await UserDetailsRepository.postUserDetails({
      user_id: this.user_id,
      user_codename: this.user_codename,
      user_image: this.user_image,
      user_first_name: this.user_first_name,
      user_last_name: this.user_last_name,
      user_occupation: this.user_occupation,
      user_gender: this.user_gender,
      user_birthdate: this.user_birthdate,
      user_agreement: this.user_agreement,
    });

    return userDetail ? new UserDetails(userDetail) : userDetail;
  }

}