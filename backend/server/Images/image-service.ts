// @ts-ignore
import sharp, {FitEnum} from "sharp";
import z from "zod";
import {ImageSchema, ImageTypes} from "@/server/types/image-types.image";
import {Request} from "express";
import {log} from "@/server/utils/log";
import {
  CompleteMultipartUploadCommandOutput,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand
} from "@aws-sdk/client-s3";
import {Upload} from "@aws-sdk/lib-storage";
import {Bucket, GetObjectCommandProcessing, s3} from "@/server/Images/image";
import {R2_FILE_PREFIX} from "@/server/utils/constants";

export type Formats = "webp" | "png" | "jpg" | "jpeg";

export class ImageProcess {
  private image: ArrayBuffer;

  // Resizing
  private shouldResize: boolean = false;
  private width?: number | undefined = undefined;
  private height?: number | undefined = undefined;
  private resizeOptions?: sharp.ResizeOptions | undefined = undefined;
  
  private shouldChangeToWebp: boolean = false;
  private webpOptions: sharp.WebpOptions = {};

  // Change format
  private shouldChangeFormat: boolean = false;
  private format: Formats = "webp";

  constructor(arrayBuffer: ArrayBuffer) {
    this.image = arrayBuffer;
    return this;
  }

  resize(width: number, height?: number | undefined, options?: sharp.ResizeOptions | undefined) {
    this.width = width;
    this.height = height;
    this.resizeOptions = options;
    this.shouldResize = true;

    return this;
  }

  webp(options: sharp.WebpOptions) {
    this.shouldChangeToWebp = true;
    this.webpOptions = options;

    return this;
  }

  changeFormat(format: Formats) {
    this.shouldChangeFormat = true;
    this.format = format;

    return this;
  }

  metadata() {
    return sharp(this.image).metadata();
  }

  result() {
    let procImg = sharp(this.image);
    
    if(this.shouldResize) {
      procImg = procImg.resize(this.width, this.height || null, this.resizeOptions)
    }

    if(this.shouldChangeToWebp) {
      procImg = procImg.toFormat("webp").webp(this.webpOptions);
    }

    if(this.shouldChangeFormat) {
      procImg = procImg.toFormat(this.format);
    }

    return procImg.withMetadata().toBuffer();
  }
}

export class ImageService {
  static async imageTransformService(req: Request):
    Promise<z.infer<typeof ImageSchema.TransformImage> | undefined> {

    const {src,h ,w, fit='cover', quality=undefined, format=undefined, upscale=false, upscaleMethod="nearest"} = req.query;

    try {
      let arrayBuffer: ArrayBuffer;

      if(String(src).startsWith("/")) {
        const response = await fetch(process.env.BASE_WEB_INTERNAL_URL + "/" + src);

        if(!response.ok) {
          log("Failed to fetch image: " + response.statusText);
          return undefined;
        }

        arrayBuffer = await response.arrayBuffer();
      } else if(String(src).startsWith(R2_FILE_PREFIX)) {
        const key = String(src).split(R2_FILE_PREFIX)[1];
        const command = new GetObjectCommand({
          Bucket: process.env.CF_BUCKET!,
          Key: key
        });

        const commandOutput = await s3.send(command);
        const byteArray = await GetObjectCommandProcessing.getByteArray(commandOutput);
        arrayBuffer = byteArray.buffer as ArrayBuffer;

      } else {
        const response = await fetch(src as string);

        if(!response.ok) {
          log("Failed to fetch image: " + response.statusText);
          return undefined;
        }

        arrayBuffer = await response.arrayBuffer();
      }

      let image = new ImageProcess(arrayBuffer);

      const widthCheck: boolean = z.number().safeParse(Number(w)).success;
      const heightCheck: boolean = z.number().safeParse(Number(h)).success;

      if(widthCheck) {
        image = heightCheck ?
          image.resize(Number(w), Number(h), {fit: fit as keyof FitEnum, kernel: upscale || upscale === "true" ? sharp.kernel[String(upscaleMethod) as keyof typeof sharp.kernel] : undefined}) :
          image.resize(Number(w), undefined, {fit: fit as keyof FitEnum, kernel: upscale || upscale === "true" ? sharp.kernel[String(upscaleMethod) as keyof typeof sharp.kernel] : undefined});
      }

      if(quality !== undefined) {
        image = image.webp({quality: Number(quality) });
      }

      if(format !== undefined) {
        image = image.changeFormat(format as Formats || "webp");
      }

      const resultImage = await image.result();
      const metadata = await image.metadata();

      return {
        image_buffer: resultImage.toString("base64"),
        image_type: metadata.format === 'jpg' ? 'image/jpeg':'image/' + metadata.format as ImageTypes
      }

    } catch(e) {
      log(e);

      return undefined;
    }

  }

  static async uploadToR2Public(folder: string, file: Buffer, filename: string, file_extension: string, content_type: string): Promise<CompleteMultipartUploadCommandOutput> {
    const upload = new Upload({
      client: s3,
      params: {
        Bucket: Bucket,
        Body: file,
        Key: `${folder}/${filename}.${file_extension}`,
        ContentType: content_type,
      },
      leavePartsOnError: false,
    });

    upload.on("httpUploadProgress", progress =>  {
      console.log(`Upload progress ${progress.loaded} of ${progress.total}`);
    });

    return await upload.done();
  }

  static async deleteR2Public(key: string | string[]) {
    if(Array.isArray(key)) {
      await s3.send(new DeleteObjectsCommand({
        Bucket,
        Delete: {
          Objects: key.map( k => ({Key: k.startsWith(R2_FILE_PREFIX) ? k.split(R2_FILE_PREFIX)[1] : k}))
        }
      }))
    } else {
      await s3.send(new DeleteObjectCommand({
        Bucket,
        Key: key
      }))
    }
  }
}