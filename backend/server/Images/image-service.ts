import sharp from "sharp";

export class ImageProcess {
  private image: ArrayBuffer;

  // Resizing
  private shouldResize: boolean = false;
  private width?: number | undefined = undefined;
  private height?: number | undefined = undefined;
  private resizeOptions?: sharp.ResizeOptions | undefined = undefined;
  
  private shouldChangeToWebp: boolean = false;
  private webpOptions: sharp.WebpOptions;

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
  }

  result() {
    let procImg = sharp(this.image);
    
    if(this.shouldResize) {
      procImg = procImg.resize(this.width, this.height || null, this.resizeOptions)
    }

    if(this.shouldChangeToWebp) {
      procImg = procImg.webp(this.webpOptions);
    }

    return procImg.toBuffer();
  }
}