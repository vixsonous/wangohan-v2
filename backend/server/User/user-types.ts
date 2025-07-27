export interface UserDisplay {
  user_id: number;
  user_codename: string;
  user_image: string;
}

export interface UserDetailsData {
  user_first_name: string;
  user_last_name: string;
  user_codename: string;
  user_image: string;
  user_agreement: number;
  user_gender: string;
  user_birthdate: Date;
  user_id: number;
  user_occupation: string;
  updated_at: Date;
  created_at: Date;
}

export interface UserCredentials {
  user_id?: number | undefined,
  email?: string | undefined,
  google_id?: string | undefined,
  password?: string | undefined
}

export const UserLevel = {
  super_admin: 0,
  admin: 1,
  user: 2
}