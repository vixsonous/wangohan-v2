import {ApiResponse, ApiTest} from "@/server/utils/ApiUtils";
import { Request, Response } from "express";
import {PetSchema} from "@/server/types/pet-types.pet";
import {PetService} from "@/server/Pet/pet-service";
import {log} from "@/server/utils/log";

export class PetController {

  static async postPet(req: Request, res: Response) {
    const data = req.body;

    const submitData = {
      ...data,
      user_id: Number(data.user_id),
      pet_birthdate: new Date(data.pet_birthdate),
      pet_image: req.file
    };

    const postPetResult = PetSchema.PostPet.safeParse(submitData);

    if(!postPetResult.success) {
      log("Invalid post pet data!");
      log(postPetResult.error.issues[0].message);
      ApiResponse.error(res, "Invalid post pet data!");
      return;
    }

    const pet = await PetService.postPet(postPetResult.data);

    if(pet === undefined) {
      log("There was an error posting pet!");
      ApiResponse.error(res, "There was an error posting pet!");
      return;
    }

    ApiResponse.success(res, "Successfully posted pet!", pet);
  }
}