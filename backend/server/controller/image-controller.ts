import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiUtils";
import sharp from 'sharp';
import z from 'zod';
import { Image } from "../service/image-service";

export class ImageController {
  static async transformImage(req: Request, res: Response) {
    const {src,h ,w, fit='cover', quality=100, format="webp", upscale=false, upscaleMethod="nearest"} = req.query;
    
    const srcCheck: boolean = z.string().min(1).safeParse(src).success;
    if(!srcCheck) {
      ApiResponse.error(res, "Image source is required");
      return;
    }

    try {
      const response = await fetch("http://wangohan_web:3000/" + src);

      if(!response.ok) {
        ApiResponse.error(res, "Failed to fetch image: " + response.statusText);
        return;
      }

      const arrayBuffer = await response.arrayBuffer();

      let image = new Image(arrayBuffer);
      
      const widthCheck: boolean = z.number().safeParse(Number(w)).success;
      const heightCheck: boolean = z.number().safeParse(Number(h)).success;

      if(widthCheck) {
        image = heightCheck ? image.resize(Number(w), Number(h)) : image.resize(Number(w));
      }

      const resultImage = await image.result();
      const metadata = await sharp(resultImage).metadata();
      
      res.header('Content-Type', metadata.format === 'jpg' ? 'image/jpeg':'image/' + metadata.format);
      res.send(resultImage);
    } catch(e) {
      console.log(e);
    }

    
    // ApiResponse.success(res);
  }
}