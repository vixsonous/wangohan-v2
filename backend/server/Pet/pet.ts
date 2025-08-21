import z from "zod";
import {PetSchema} from "@/server/types/pet-types.pet";

export class Pet {
 protected pet_name: string;
 protected pet_birthdate: Date;
 protected pet_breed: string;

 constructor(pet: z.infer<typeof PetSchema.Pet>) {
   this.pet_name = pet.pet_name;
   this.pet_birthdate = pet.pet_birthdate;
   this.pet_breed = pet.pet_breed;
 }
}

export class PostPet extends Pet {
  protected pet_image: Express.Multer.File;
  protected updated_at: Date;
  protected created_at: Date;
  constructor(pet: z.infer<typeof PetSchema.PostPet>) {
    super(pet);
    this.pet_image = pet.pet_image;
    this.updated_at = pet.updated_at || new Date();
    this.created_at = pet.created_at || new Date();
  }
}