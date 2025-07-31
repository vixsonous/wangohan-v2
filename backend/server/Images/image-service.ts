import sharp from "sharp";

export class Image {
  private image: ArrayBuffer;

  // Resizing
  private shouldResize: boolean = false;
  private width?: number | undefined = undefined;
  private height?: number | undefined = undefined;


  constructor(arrayBuffer: ArrayBuffer) {
    this.image = arrayBuffer;
    return this;
  }

  resize(width: number, height?: number) {
    this.width = width;
    this.height = height;
    this.shouldResize = true;

    return this;
  }

  result() {
    let procImg = sharp(this.image);
    
    if(this.shouldResize) {
      procImg = procImg.resize({
        width: this.width,
        height: this.height
      })
    }

    return procImg.toBuffer();
  }
}