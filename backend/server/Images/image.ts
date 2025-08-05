import { CompleteMultipartUploadCommandOutput, S3Client} from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';
import { Upload } from '@aws-sdk/lib-storage';
dotenv.config();

const Bucket = process.env.CF_BUCKET;
const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  }
})

export class Image {
  private image: Express.Multer.File;

  constructor(image: Express.Multer.File) {
    this.image = image;
  }

  static async uploadToR2Public(folder: string, file: Buffer, filename: string, file_extension: string, content_type: string): Promise<CompleteMultipartUploadCommandOutput> {
    const upload = new Upload({
      client: s3,
      params: {
        Bucket,
        Body: file,
        Key: `${folder}/${filename}.${file_extension}`,
        ContentType: content_type,
      },
      leavePartsOnError: false
    });

    return await upload.done();
  }
}