import z from "zod";

export type ImageTypes = "image/webp"|"image/png" | "image/jpg" | "image/jpeg";

export class ImageSchema {
  static TransformImage = z.object({
    image_buffer: z.string().nonoptional("Image buffer required!"),
    image_type: z.custom<ImageTypes>().nonoptional("Image content-type required!")
  })
}