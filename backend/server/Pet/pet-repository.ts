import {PetInsert, PetUpdate} from "@/database/types";
import z from "zod";
import {PetSchema} from "@/server/types/pet-types.pet";
import {log} from "@/server/utils/log";
import {DatabaseTransaction, db} from "@/database/database";
import {sql} from "kysely";

export class PetRepository {

  static async postPet(pet: PetInsert, trx: DatabaseTransaction) {

    const getPet: z.infer<typeof PetSchema.GetPet> = await trx.insertInto("pets_table")
      .values(pet)
      .returningAll()
      .executeTakeFirstOrThrow();

    return getPet;
  }
  
  static async updatePet(updatePet: PetUpdate, trx: DatabaseTransaction): Promise<z.infer<typeof PetSchema.GetPet>> {
    return await trx.updateTable("pets_table")
      .set(updatePet)
      .where("pet_id", "=", updatePet.pet_id || -1)
      .returning([
        "pet_id",
        "user_id",
        "pet_image",
        "pet_breed",
        "pet_name",
        "pet_birthdate"
      ])
      .executeTakeFirstOrThrow();
  }

  static async getOldPetImage(pet_id: number, trx: DatabaseTransaction) {
    return await trx.selectFrom("pets_table").select("pet_image").where("pet_id", "=", pet_id).executeTakeFirstOrThrow();
  }

  static async getBirthdayMonthPets(current_month: number): Promise<Array<z.infer<typeof PetSchema.GetPet>> | undefined> {
    const BIRTHDAY_PET_RETRIEVAL_SUCCESS = "Successfully retrieved birthday pets";
    try {
      const pets = await db.selectFrom("pets_table")
        .selectAll()
        .where(({ ref }) =>
          sql`EXTRACT(MONTH FROM ${ref('pet_birthdate')}) = ${current_month}`
        )
        .execute();

      log(BIRTHDAY_PET_RETRIEVAL_SUCCESS);

      return pets;
    } catch (e) {
      log(e);
      log("Failed to retrieve pets!");
      return undefined;
    }
  }
}