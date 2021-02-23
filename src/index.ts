import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import { AppModule } from '@modules/app';
import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { APP_ORIGIN, APP_PORT, IS_PROD } from '@constants';

/**
 * Gets HTTP/S NestJS application
 */
async function getApp(): Promise<INestApplication> {
  if (IS_PROD) {
    return NestFactory.create(AppModule, {
      httpsOptions: {
        key: fs.readFileSync(process.env.APP_SSL_KEY as string, 'utf-8'),
        cert: fs.readFileSync(process.env.APP_SSL_CRT as string, 'utf-8')
      }
    });
  }
  return NestFactory.create(AppModule);
}

/**
 * Bootstraps API server
 */
async function bootstrap() {
  const app = await getApp();
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  app.use(morgan('combined'));
  app.enableCors({ origin: APP_ORIGIN, credentials: true });
  await app.listen(APP_PORT);
}

bootstrap().catch(console.error);
