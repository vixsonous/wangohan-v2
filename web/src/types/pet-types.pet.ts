import z from "zod";

export class PetSchema {
  public static Pet = z.object({
    user_id: z.number(),
    pet_name: z.string().min(1, "Please enter your pet's name!"),
    pet_birthdate: z.date("Please enter your pet's birthdate!"),
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