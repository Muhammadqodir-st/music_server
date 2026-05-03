import { S3Client } from '@aws-sdk/client-s3';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
    // private readonly s3: S3Client;
    // private readonly logger = new Logger(AwsService.name)

    // private readonly region: string;
    // private readonly bucket: string;

    // constructor(private readonly config: ConfigService) {
    //     const accessKeyId = this.config.get<string>('AWS_ACCESS_KEY_ID');
    //     const secretAccessKey = this.config.get<string>('AWS_SECRET_ACCESS_KEY');
    //     this.region = this.config.get<string>('AWS_REGION') ?? '';
    //     this.bucket = this.config.get<string>('AWS_BUCKET') ?? '';

    //     const missing = [
    //         !accessKeyId && 'AWS_ACCESS_KEY_ID',
    //         !secretAccessKey && 'AWS_SECRET_ACCESS_KEY',
    //         !this.region && 'AWS_REGION',
    //         !this.bucket && 'AWS_BUCKET'
    //     ].filter(Boolean);

    //     if (missing.length) {
    //         this.logger.error(`AWS configuration is missing: ${missing.join(', ')}`);
    //         throw new Error('AWS configuration is incomplate');
    //     };

    //     this.s3 = new S3Client({
    //         region: this.region,
    //         credentials: { accessKeyId: accessKeyId!, secretAccessKey: secretAccessKey! }
    //     });
    // };

    // async uploadArtwork(file: Express.Multer.File) {
    //     if (!file) {
    //         throw new HttpException("No file provided", HttpStatus.BAD_REQUEST)
    //     };

        
    //     if (file.mimetype === "image/xml") {

    //     }
    // }
}
