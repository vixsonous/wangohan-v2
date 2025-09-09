import z from "zod";

export class PetSchema {
  public static Pet = z.object({
    user_id: z.number(),
    pet_name: z.string(),
    pet_birthdate: z.date(),
    pet_breed: z.string(),
    updated_at: z.date().optional(),
    created_at: z.date().optional()
  });

  public static GetPet = z.object({
    pet_id: z.number(),
    pet_image: z.string(),
  }).and(PetSchema.Pet);

  public static PostPet = z.object({
    pet_image: z.custom<Express.Multer.File>()
  }).and(PetSchema.Pet);
}