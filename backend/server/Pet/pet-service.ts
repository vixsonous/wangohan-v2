import z from "zod";
import {PetSchema} from "@/server/types/pet-types.pet";
import {PetRepository} from "@/server/Pet/pet-repository";
import {db} from "@/database/database";
import {ImageService} from "@/server/Images/image-service";
import {FolderNameUtils, ImageKeyUtils} from "@/server/utils/string-utils";
import {PetInsert, PetUpdate} from "@/database/types";
import {ImageServiceError} from "@/server/types/error-types";

export class PetService {
  static async postPet(pet: z.infer<typeof PetSchema.PostPet>): Promise<z.infer<typeof PetSchema.GetPet>> {

    let newPetImageKey = '';

    return await db.transaction().execute(async trx => {
      try {
        const petInsert = {
          pet_image: '',
          pet_name: pet.pet_name,
          pet_birthdate: pet.pet_birthdate,
          pet_breed: pet.pet_breed,
          user_id: pet.user_id,
          updated_at: pet.updated_at || new Date(),
          created_at: pet.created_at || new Date(),
        } satisfies PetInsert;

        const newPet = await PetRepository.postPet(petInsert, trx);

        const imageBuffer = await ImageService.getProcessedImageBuffer({
          fileBuffer: pet.pet_image.buffer,
          quality: 80,
          width: 1024,
          fit: "inside"
        });

        const fileName = ImageService.getFileName(pet.pet_image);
        const folderName = FolderNameUtils.petFolder(pet.user_id, newPet.pet_id);
        newPetImageKey = await ImageService.uploadToR2Public(folderName, imageBuffer, fileName, "webp", "images/webp");

        const petUpdate = {pet_image: ImageKeyUtils.generateR2Key(newPetImageKey), pet_id: newPet.pet_id} satisfies PetUpdate;

        return await PetRepository.updatePet(petUpdate, trx);
      } catch(error) {
        if(newPetImageKey !== '') {
          await ImageService.deleteR2Public(newPetImageKey);
        }
        throw error;
      }
    })


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
      fileKeyToUpdate = await ImageService.uploadToR2Public(folderName, imageBuffer, fileName, "webp", "images/webp");
    }

    return await db.transaction().execute(async trx => {
      try {
        const updatePetValues = {
          ...pet,
          pet_image: fileKeyToUpdate !== "" ? ImageKeyUtils.generateR2Key(fileKeyToUpdate) : undefined,
          updated_at: new Date(),
        } satisfies PetUpdate;

        const oldImageKey = await PetRepository.getOldPetImage(pet.pet_id, trx);
        const updatedPet = await PetRepository.updatePet(updatePetValues, trx);

        if(hasNewImage) {
          await ImageService.deleteR2Public(oldImageKey.pet_image);
        }

        return updatedPet;
      } catch(error) {
        if(fileKeyToUpdate !== "") {
          await ImageService.deleteR2Public(fileKeyToUpdate);
        }
        throw error;
      }
    })


  }

  static async getBirthdayMonthPets(current_month: number): Promise<Array<z.infer<typeof PetSchema.GetPet>> | undefined> {
    return await PetRepository.getBirthdayMonthPets(current_month);
  }
}