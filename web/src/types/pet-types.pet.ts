import z from "zod";
import {format, isValid, parse} from "date-fns";

export class PetSchema {
  public static Pet = z.object({
    user_id: z.number(),
    pet_name: z.string().min(1, "Please enter your pet's name!"),
    pet_birthdate: z.string("Please enter your pet's birthdate!").refine(val => {
      const parsed = parse(val, 'yyyy-MM-dd', new Date());
      return isValid(parsed) && val === format(parsed, 'yyyy-MM-dd');
    }, {
      message: "Invalid birthdate, yyyy-MM-dd is expected!"
    }),
    pet_breed: z.string().min(1, "Please enter your pet's breed!"),
    updated_at: z.date().optional(),
    created_at: z.date().optional()
  });

  public static GetPet = z.object({
  pet_id: z.number(),
  pet_image: z.string(),
  }).and(PetSchema.Pet);

  public static PostPet = z.object({
    pet_image: z.file("Please provide an image for your pet!")
  }).and(PetSchema.Pet);
}