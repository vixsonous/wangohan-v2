export class Image {
  private image: Express.Multer.File;

  constructor(image: Express.Multer.File) {
    this.image = image;
  }
}