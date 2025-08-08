import z from "zod";

export class FileSchema {
  static FileDisplaySchema = z.array(z.object({
    file: z.file().optional(),
    preview_url: z.string().min(1, "Please provide preview url")
  })).min(1, "Please upload some pictures");
}