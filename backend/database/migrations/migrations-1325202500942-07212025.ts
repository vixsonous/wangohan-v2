import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("pets_table")
    .alterColumn("pet_birthdate",col => col.setDataType("date"))
    .execute();

  await db.schema.alterTable("user_details_table")
    .alterColumn("user_birthdate",col => col.setDataType("date"))
    .execute();
}