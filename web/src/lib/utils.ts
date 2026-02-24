import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {formatInTimeZone} from "date-fns-tz";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export class DateUtils {
  static getFormattedDate(date: Date | undefined, format:string = 'yyyy-MM-dd') {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if(date === undefined) return "";
    return formatInTimeZone(date, timeZone, format);
  }
}

export class FileUtils {
  static async clientUpload(file: File): Promise<File> {
    return new Promise(async (resolve) => {
      const heic2any = (await import("heic2any")).default;
      let retFile = file;
      const fileExt = file.name.substring(file.name.lastIndexOf(".") + 1);

      if(typeof window !== undefined && (fileExt.toLowerCase() === "heic" || fileExt.toLowerCase() === "heif")) {
        const image = await heic2any({
          blob: file,
          toType: "image/webp",
          quality: 0.8,

        });

        const img = !Array.isArray(image) ? [image] : image;
        retFile = new File(img, file.name);
      }

      resolve(retFile);
    })
  }
}