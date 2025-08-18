import z from "zod";

export class UserDetailSchema {
  static UserDetails = z.object({
    user_id: z.number().min(1, "User ID is required!"),
    user_first_name: z.string().min(1, "Please enter the first name!").max(50, "Please provide less than 50 characters!"),
    user_last_name: z.string().min(1, "Please enter the last name!").max(50, "Please provide less than 50 characters!"),
    user_codename: z.string().min(1, "Please enter your username!").max(50, "Please provide less than 50 characters!"),
    user_agreement: z.number("You have to agree to the terms and conditions!").gt(0, "You have to agree to the terms and conditions!"),
    user_gender: z.string("Please select your gender!"),
    user_birthdate: z.date("Please select your birthdate!"),
    user_occupation: z.string().min(1, "Please enter your occupation!").max(50, "Please provide less than 50 characters!"),
    updated_at: z.date().optional(),
    created_at: z.date().optional()
  });

  static GetUserDetails = UserDetailSchema.UserDetails.and(z.object({
    user_image: z.string()
  }))

  static PostUserDetails = UserDetailSchema.UserDetails.and(z.object({
    user_image: z.file("Please provide your profile image!")
  }))
}