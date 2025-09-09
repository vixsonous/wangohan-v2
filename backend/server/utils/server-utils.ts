import {Request} from 'express';
import z from "zod";
import {UserSchema} from "@/server/types/user-types.user";
export const getUserData = (req: Request): z.infer<typeof UserSchema.User> | undefined => {

  return req.user as z.infer<typeof UserSchema.User> | undefined;
}