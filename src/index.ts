import { config } from 'dotenv';
config();

import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import { readFileSync } from 'fs';
import { AppModule } from '@modules/app';
import { NestFactory } from '@nestjs/core';
import { connect, connection } from 'mongoose';
import { INestApplication } from '@nestjs/common';
import { APP_ORIGIN, APP_PORT, IS_PROD } from '@constants';

/**
 * Creates a DB connection.
 */
function createConnection(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    console.log('Connecting to DB...');
    const dbURL = process.env.DB_URL as string;
    const dbOpt = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true };
    connect(dbURL, dbOpt);
    connection.once('open', () => {
      console.log('Connected to DB');
      resolve(true);
    });
    connection.on('error', (error) => {
      console.error('Could not connect to DB');
      console.error(error);
      reject(false);
    });
  });
}

/**
 * Gets HTTP/S NestJS application
 */
async function getApp(): Promise<INestApplication> {
  if (IS_PROD) {
    return NestFactory.create(AppModule, {
      httpsOptions: {
        key: readFileSync(process.env.APP_SSL_KEY as string, 'utf-8'),
        cert: readFileSync(process.env.APP_SSL_CRT as string, 'utf-8')
      }
    });
  }
  return NestFactory.create(AppModule);
}

/**
 * Bootstraps API server
 */
async function bootstrap() {
  await createConnection();
  const app = await getApp();
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  app.use(morgan('combined'));
  app.enableCors({ origin: APP_ORIGIN, credentials: true });
  await app.listen(APP_PORT);
}

bootstrap().catch(console.error);
