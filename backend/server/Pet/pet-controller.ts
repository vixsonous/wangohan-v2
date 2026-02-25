import {ApiResponse, ErrorResponseHandler} from "@/server/utils/ApiUtils";
import { Request, Response } from "express";
import {PetSchema} from "@/server/types/pet-types.pet";
import {PetService} from "@/server/Pet/pet-service";
import {log} from "@/server/utils/log";
import {getUserData} from "@/server/utils/server-utils";
import {ERROR_CLASS_NAMES} from "@/server/types/error-types";

export class PetController {

  static async postPet(req: Request, res: Response) {
    try {
      const userData = getUserData(req);
      const data = req.body;
      const submitData = {
        ...data,
        user_id: userData.user_id,
        pet_birthdate: new Date(data.pet_birthdate),
        pet_image: req.file,
        updated_at: new Date(data.updated_at),
        created_at: new Date(data.created_at),
      };

      const postPetData = PetSchema.PostPet.parse(submitData);

      const pet = await PetService.postPet(postPetData);

      ApiResponse.success(res, "Successfully posted pet!", pet);
    } catch (error) {
      ErrorResponseHandler.handle(error as Error, res);
    }
  }

  static async putPet(req: Request, res: Response) {
    try {
      const data = req.body;
      const userData = getUserData(req);
      const pet_id = Number(req.params.pet_id);
      const submitData = {
        ...data,
        user_id: userData.user_id,
        pet_birthdate: new Date(data.pet_birthdate),
        pet_image: req.file,
        pet_id,
        updated_at: new Date(data.updated_at),
        created_at: new Date(data.created_at),
      };

      const putPetResult = PetSchema.PutPet.parse(submitData);
      const pet = await PetService.putPet(putPetResult);

      ApiResponse.success(res, "Successfully updated pet!", pet);
    } catch(error) {

      ErrorResponseHandler.handle(error as Error, res);
    }
  }

  static async getBirthdayMonthPets(req: Request, res: Response) {
    const {current_month} = req.query;
    const curMonth = Number(current_month);

    if(curMonth < 0 || curMonth > 12) {
      log("Invalid current month!");
      ApiResponse.error(res, "Invalid month!");
      return;
    }

    const birthdayPets = await PetService.getBirthdayMonthPets(Number(current_month));

    ApiResponse.success(res, "Successfully retrieved current month birthday pets", birthdayPets);
  }
}