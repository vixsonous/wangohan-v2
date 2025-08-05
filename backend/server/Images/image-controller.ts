import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiUtils";
import z from 'zod';
import {Formats, ImageProcess} from "./image-service";
// @ts-ignore
import sharp from 'sharp';

export class ImageController {
  static async transformImage(req: Request, res: Response) {
    const {src,h ,w, fit='cover', quality=undefined, format=undefined, upscale=false, upscaleMethod="nearest"} = req.query;
    const srcCheck: boolean = z.string().min(1).safeParse(src).success;
    if(!srcCheck) {
      ApiResponse.error(res, "Image source is required");
      return;
    }

    try {
      let response: any;

      if(String(src).startsWith("/")) {
        response = await fetch(process.env.BASE_WEB_INTERNAL_URL + "/" + src);
      } else if(String(src).startsWith("r2://")) {
        response = await fetch(process.env.BASE_PUBLIC_BUCKET_URL + "/" + String(src).split("r2://")[1]);
      } else {
        response = await fetch(src as string);
      }

      if(!response.ok) {
        ApiResponse.error(res, "Failed to fetch image: " + response.statusText);
        return;
      }

      const arrayBuffer = await response.arrayBuffer();

      let image = new ImageProcess(arrayBuffer);
      
      const widthCheck: boolean = z.number().safeParse(Number(w)).success;
      const heightCheck: boolean = z.number().safeParse(Number(h)).success;

      if(widthCheck) {
        image = heightCheck ?
          image.resize(Number(w), Number(h), {fit, kernel: upscale ? sharp.kernel[upscaleMethod] : sharp.kernel.nearest}) :
          image.resize(Number(w), undefined, {fit, kernel: upscale ? sharp.kernel[upscaleMethod] : sharp.kernel.nearest});
      }

      if(quality !== undefined) {
        image = image.webp({quality, })
      }

      if(format !== undefined) {
        image = image.changeFormat(format as Formats || "webp");
      }

      const resultImage = await image.result();
      const metadata = await image.metadata();
      
      res.header('Content-Type', metadata.format === 'jpg' ? 'image/jpeg':'image/' + metadata.format);
      res.send(resultImage);
    } catch(e) {
      console.log(e);
    }

    
    // ApiResponse.success(res);
  }
}