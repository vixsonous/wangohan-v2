import {ServerApiResponseService, ServerApiService} from "@/lib/server-utils";
import z from "zod";
import {PetSchema} from "@/types/pet-types.pet";

export const getBirthdayMonthPets = async (): Promise<Array<z.infer<typeof PetSchema.GetPet>>> => {
  const currentMonth = Number(new Date().getMonth()) + Number(1);
  const pets = await ServerApiService.get("/birthday-pets?current_month=" + currentMonth);
  return await ServerApiResponseService.getResponseData<Array<z.infer<typeof PetSchema.GetPet>>>(pets);
}