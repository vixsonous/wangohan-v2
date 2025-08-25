import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiUtils";
import z from 'zod';
import {ImageService} from "./image-service";
// @ts-ignore
import {CacheUtil, RecipeCacheKey} from "@/server/utils/redis";
import {ImageSchema} from "@/server/types/image-types.image";

export class ImageController {

  private static IMAGE_ERROR_MESSAGE: Record<string, string> = {
    IMAGE_SOURCE_REQUIRED: "Image source is required",
    IMAGE_TRANSFORM_FAILED: "Image transformation failed!",
  }
  static async transformImage(req: Request, res: Response) {
    const {src,h ,w, fit='cover', quality=100, format="webp", upscale=false, upscaleMethod="nearest"} = req.query;

    const srcCheck: boolean = z.string().min(1).safeParse(src).success;
    if(!srcCheck) {
      ApiResponse.error(res, this.IMAGE_ERROR_MESSAGE.IMAGE_ERROR_MESSAGE);
      return;
    }

    const key = RecipeCacheKey.TRANSFORM_IMAGE(
      String(src),
      String(h),
      String(w),
      String(fit),
      String(quality),
      String(format),
      String(upscale),
      String(upscaleMethod)
    );

    const resultImage = await CacheUtil.get<z.infer<typeof ImageSchema.TransformImage>, typeof ImageService.imageTransformService>(key, ImageService.imageTransformService, 60, req);

    if(resultImage === undefined) {
      ApiResponse.error(res, this.IMAGE_ERROR_MESSAGE.IMAGE_TRANSFORM_FAILED);
      return;
    }

    const sendImage = Buffer.from(resultImage.image_buffer, "base64");

    res.header('Content-Type', resultImage.image_type);
    res.send(sendImage);
  }
}