// @ts-ignore
import sharp from "sharp";

export type Formats = "webp" | "png" | "jpg" | "jpeg";

export class ImageProcess {
  private image: ArrayBuffer;

  // Resizing
  private shouldResize: boolean = false;
  private width?: number | undefined = undefined;
  private height?: number | undefined = undefined;
  private resizeOptions?: sharp.ResizeOptions | undefined = undefined;
  
  private shouldChangeToWebp: boolean = false;
  private webpOptions: sharp.WebpOptions;

  // Change format
  private shouldChangeFormat: boolean = false;
  private format: Formats | undefined = undefined;

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