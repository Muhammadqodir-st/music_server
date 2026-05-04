import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';
import { v4 as uuid } from 'uuid'

@Injectable()
export class AwsService {
    private readonly s3: S3Client;
    private readonly logger = new Logger(AwsService.name)

    private readonly region: string;
    private readonly bucket: string;

    constructor(private readonly config: ConfigService) {
        const accessKeyId = this.config.get<string>('AWS_ACCESS_KEY_ID');
        const secretAccessKey = this.config.get<string>('AWS_SECRET_ACCESS_KEY');
        this.region = this.config.get<string>('AWS_REGION') ?? '';
        this.bucket = this.config.get<string>('AWS_BUCKET') ?? '';

        const missing = [
            !accessKeyId && 'AWS_ACCESS_KEY_ID',
            !secretAccessKey && 'AWS_SECRET_ACCESS_KEY',
            !this.region && 'AWS_REGION',
            !this.bucket && 'AWS_BUCKET'
        ].filter(Boolean);

        if (missing.length) {
            this.logger.error(`AWS configuration is missing: ${missing.join(', ')}`);
            throw new Error('AWS configuration is incomplate');
        };

        this.s3 = new S3Client({
            region: this.region,
            credentials: { accessKeyId: accessKeyId!, secretAccessKey: secretAccessKey! }
        });
    };

    async uploadArtwork(file: Express.Multer.File) {
        if (!file) {
            throw new HttpException("No file provided", HttpStatus.BAD_REQUEST);
        }

        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            throw new HttpException("File too large", HttpStatus.BAD_REQUEST);
        }

        const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new HttpException("Invalid file type", HttpStatus.BAD_REQUEST);
        }

        const key = `public/${uuid()}.webp`;

        try {
            const optimizedBuffer = await sharp(file.buffer)
                .resize(1024, 1024, {
                    fit: "inside",
                    withoutEnlargement: true
                })
                .webp({ quality: 60 })
                .toBuffer();


            await this.s3.send(
                new PutObjectCommand({
                    Bucket: this.bucket,
                    Key: key,
                    Body: optimizedBuffer,
                    ContentType: "image/webp",
                })
            );

            const url = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;

            return { url };
        } catch (error) {
            this.logger.error(error);
            throw new HttpException("Upload failed", HttpStatus.INTERNAL_SERVER_ERROR);
        };
    };

    async uploadMusic(file: Express.Multer.File) {
        if (!file) {
            throw new HttpException("No file provided", HttpStatus.BAD_REQUEST);
        }

        const MAX_SIZE = 20 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            throw new HttpException("File too large", HttpStatus.BAD_REQUEST);
        };

        const allowedMimeTypes = [
            "audio/mpeg",
            "audio/wav",
            "audio/webm",
            "audio/ogg"
        ];

        const detected = await fileTypeFromBuffer(file.buffer.subarray(0, 4100));

        if (!detected) {
            throw new HttpException("Cannot detect file type", HttpStatus.BAD_REQUEST);
        };

        if (!allowedMimeTypes.includes(detected.mime)) {
            throw new HttpException("Invalid audio type", HttpStatus.BAD_REQUEST);
        };

        const allowedExt = ['mp3', 'wav', 'webm', 'ogg'];

        if (!allowedExt.includes(detected.ext)) {
            throw new HttpException("Unsupported audio format", HttpStatus.BAD_REQUEST);
        };

        const key = `music/${uuid()}.${detected.ext}`;

        try {
            await this.s3.send(new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: file.buffer,
                ContentType: detected.mime,
                CacheControl: "public, max-age=31536000",
                Metadata: {
                    originalName: file.originalname,
                },
            }));

            const url = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;

            return { url };
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error("Audio upload failed", error.stack);
            } else {
                this.logger.error("Audio upload failed", JSON.stringify(error));
            }

            throw new HttpException("Upload failed", HttpStatus.INTERNAL_SERVER_ERROR);
        };
    };
};