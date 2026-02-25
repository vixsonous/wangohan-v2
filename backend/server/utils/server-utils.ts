import {Request} from 'express';
import z from "zod";
import {UserSchema} from "@/server/types/user-types.user";
import {UnauthorizedError} from "@/server/types/error-types";
export const getUserData = (req: Request): z.infer<typeof UserSchema.User> => {
  const user = req.user;

  if(user === undefined) throw new UnauthorizedError("Unauthorized!");

  return user as z.infer<typeof UserSchema.User>;
}