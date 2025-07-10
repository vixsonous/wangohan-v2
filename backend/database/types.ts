import { Generated } from "kysely";

export interface Database {
  users_table: UserTable,
  user_details_table: UserDetailTable;
}

export interface UserTable {
  user_id: Generated<number>;
  google_id: string;
  email: string;
  password:string;
  user_lvl: number;
  updated_at: Date;
  created_at: Date;
}

export interface UserDetailTable {
  user_detail_id: Generated<number>;
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