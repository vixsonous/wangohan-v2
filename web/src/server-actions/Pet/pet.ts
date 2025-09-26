import {ServerApiResponseService, ServerApiService} from "@/lib/server-utils";
import z from "zod";
import {PetSchema} from "@/types/pet-types.pet";
import {ENDPOINTS} from "@/constants/endpoints";

export const getBirthdayMonthPets = async (): Promise<Array<z.infer<typeof PetSchema.GetPet>>> => {
  const currentMonth = Number(new Date().getMonth()) + Number(1);
  const pets = await ServerApiService.get(ENDPOINTS.PET + "/birthday?current_month=" + currentMonth);
  return await ServerApiResponseService.getResponseData<Array<z.infer<typeof PetSchema.GetPet>>>(pets);
}