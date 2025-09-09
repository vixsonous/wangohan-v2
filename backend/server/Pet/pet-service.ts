import z from "zod";
import {PetSchema} from "@/server/types/pet-types.pet";
import {PetRepository} from "@/server/Pet/pet-repository";

export class PetService {
  static async postPet(pet: z.infer<typeof PetSchema.PostPet>) {
    return await PetRepository.postPet(pet);
  }

  static async getBirthdayMonthPets(current_month: number): Promise<Array<z.infer<typeof PetSchema.GetPet>> | undefined> {
    return await PetRepository.getBirthdayMonthPets(current_month);
  }
}