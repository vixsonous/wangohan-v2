import z from "zod";
import {PetSchema} from "@/server/types/pet-types.pet";
import {PetRepository} from "@/server/Pet/pet-repository";
import {db} from "@/database/database";
import {ImageService} from "@/server/Images/image-service";
import {FolderNameUtils} from "@/server/utils/string-utils";
import {PetUpdate} from "@/database/types";
import {ImageServiceError} from "@/server/errors/error-types";

export class PetService {
  static async postPet(pet: z.infer<typeof PetSchema.PostPet>) {
    return await PetRepository.postPet(pet);
  }

  static async putPet(pet: z.infer<typeof PetSchema.PutPet>) {

    let fileKeyToUpdate = "";
    const hasNewImage = pet.pet_image.size > 0;

    /* Pet image is not empty, update the image */
    if(hasNewImage) {
      const imageBuffer = await ImageService.getProcessedImageBuffer({
        fileBuffer: pet.pet_image.buffer,
        quality: 80,
        width: 1024,
        fit: "inside"
      });

      const fileName = ImageService.getFileName(pet.pet_image);

      const folderName = FolderNameUtils.petFolder(pet.user_id, pet.pet_id);
      const newPetImage = await ImageService.uploadToR2Public(folderName, imageBuffer, fileName, "webp", "images/webp");

      if(newPetImage.Key === undefined) {
        throw new ImageServiceError("Error uploading image to R2");
      }

      fileKeyToUpdate = newPetImage.Key;
    }

    const trx = await db.startTransaction().execute();

    try {
      const updatePetValues = {
        ...pet,
        pet_image: fileKeyToUpdate !== "" ? `r2://${fileKeyToUpdate}` : undefined,
        updated_at: new Date(),
      } satisfies PetUpdate;

      const oldImageKey = await PetRepository.getOldPetImage(pet.pet_id, trx);
      const updatedPet = await PetRepository.updatePet(updatePetValues, trx);
      await trx.commit().execute();

      if(hasNewImage) {
        console.log(oldImageKey.pet_image);
        await ImageService.deleteR2Public(oldImageKey.pet_image);
      }

      return updatedPet;
    } catch(error) {
      if(fileKeyToUpdate !== "") {
        await ImageService.deleteR2Public(fileKeyToUpdate);
      }
      await trx.rollback().execute();
      throw error;
    }
  }

  static async getBirthdayMonthPets(current_month: number): Promise<Array<z.infer<typeof PetSchema.GetPet>> | undefined> {
    return await PetRepository.getBirthdayMonthPets(current_month);
  }
}