import {GetObjectCommandOutput, S3Client} from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';
dotenv.config();

export const Bucket = process.env.CF_BUCKET;
export const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  }
})

export class GetObjectCommandProcessing {
  static async getByteArray(output: GetObjectCommandOutput) {
    const body = output.Body;
    if(body === undefined) {
      throw new Error("GetObjectCommandOutput body is undefined!");
    }

    return body.transformToByteArray();
  }
}