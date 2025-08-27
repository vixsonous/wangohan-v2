import {PetInsert} from "@/database/types";
import z from "zod";
import {PetSchema} from "@/server/types/pet-types.pet";
import {log} from "@/server/utils/log";
import {db} from "@/database/database";
import {ImageProcess} from "@/server/Images/image-service";
import {Image} from "@/server/Images/image";
import {sql} from "kysely";

export class PetRepository {

  static PET_REPOSITORY_SUCCESS_LOG = {
    POST_PET_SUCCESS: "Successfully posted pet!"
  }

  static PET_REPOSITORY_ERROR_LOG = {
    POST_PET_ERROR: "Failed to post pet!"
  }

  static async postPet(pet: z.infer<typeof PetSchema.PostPet>) {
    try {
      const nextPetId = await db
        .selectFrom("pets_table")
        .select(db.fn.max("pet_id").as("maxId"))
        .executeTakeFirst();

      if(nextPetId === undefined) {
        return undefined;
      }

      const nextId = nextPetId.maxId + 1;

      const buffer: Buffer<ArrayBuffer> = Buffer.from(pet.pet_image.buffer);

      let image = new ImageProcess(buffer.buffer);

      image = image.resize(1024, undefined, {
        withoutEnlargement: true,
        fit: "inside"
      });

      image = image.webp({
        quality: 80
      });

      const uploadImage = await image.result();
      const folder = `${String(pet.user_id).padStart(8, "0")}/pets/${String(nextId).padStart(8, "0")}`;
      const uploadDone = await Image.uploadToR2Public(folder, uploadImage, pet.pet_image.originalname.split(".")[0], "webp", "images/webp");

      if(uploadDone.Key === undefined) {
        return undefined;
      }

      const petInsert = {
        pet_image: `r2://${uploadDone.Key}`,
        pet_name: pet.pet_name,
        pet_birthdate: pet.pet_birthdate,
        pet_breed: pet.pet_breed,
        user_id: pet.user_id,
        updated_at: pet.updated_at || new Date(),
        created_at: pet.created_at || new Date(),
      } satisfies PetInsert;

      const getPet: z.infer<typeof PetSchema.GetPet> = await db.insertInto("pets_table")
        .values(petInsert)
        .returningAll()
        .executeTakeFirstOrThrow();

      log(PetRepository.PET_REPOSITORY_SUCCESS_LOG.POST_PET_SUCCESS);

      return getPet;
    } catch(e) {
      log(e);
      log(PetRepository.PET_REPOSITORY_ERROR_LOG.POST_PET_ERROR);
      return undefined;
    }
  }

  static async getBirthdayMonthPets(current_month: number): Promise<Array<z.infer<typeof PetSchema.GetPet>> | undefined> {
    const BIRTHDAY_PET_RETRIEVAL_SUCCESS = "Successfully retrieved birthday pets";
    try {
      console.log("Went here");
      const pets = await db.selectFrom("pets_table")
        .selectAll()
        .where(({ ref }) =>
          sql`EXTRACT(MONTH FROM ${ref('pet_birthdate')}) = ${current_month}`
        )
        .execute();
      console.log(pets);
      log(BIRTHDAY_PET_RETRIEVAL_SUCCESS);

      return pets;
    } catch (e) {
      log(e);
      log("Failed to retrieve pets!");
      return undefined;
    }
  }
}