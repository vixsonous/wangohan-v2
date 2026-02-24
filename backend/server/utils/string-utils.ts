export class FolderNameUtils {
  static petFolder(user_id: number, pet_id: number) {
    return `${String(user_id).padStart(8, "0")}/pets/${String(pet_id).padStart(8, "0")}`;
  }
}