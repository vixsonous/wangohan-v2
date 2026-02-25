import {R2_FILE_PREFIX} from "@/server/utils/constants";

export class FolderNameUtils {
  static petFolder(user_id: number, pet_id: number) {
    return `${String(user_id).padStart(8, "0")}/pets/${String(pet_id).padStart(8, "0")}`;
  }

  static profileFolder(user_id: number) {
    return `${String(user_id).padStart(8, "0")}/profile`
  }
}

export class ImageKeyUtils {
  static generateR2Key(key: string) {
    return `r2://${key}`;
  }

  static parseKey(key: string) {
    return key.startsWith(R2_FILE_PREFIX) ? key.split(R2_FILE_PREFIX)[1] : key;
  }
}