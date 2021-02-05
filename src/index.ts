// load env variables
import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import cors from 'cors';
import http from 'http';
import https from 'https';
import morgan from 'morgan';
import express from 'express';
import mongoose from 'mongoose';
import stoppable from 'stoppable';
import constants from './constants';
import compresion from 'compression';
import cookieParser from 'cookie-parser';

import { auth, task } from './api';
import { StoppableServer } from 'stoppable';

/** HTTP/S server */
let server: StoppableServer;

/**
 * Creates a DB connection.
 */
function createConnection(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    console.log('Connecting to DB...');
    mongoose.connect(constants.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
    mongoose.connection.once('open', () => {
      console.log('Connected to DB');
      resolve(true);
    });
    mongoose.connection.on('error', (error) => {
      constants.LOGGER.fatal('Could not connect to DB');
      constants.LOGGER.fatal(error);
      reject(false);
    });
  });
}

/**
 * Gets HTTP/S server.
 *
 * @param app - ExpressJS application
 */
function getServer(app: express.Express): StoppableServer {
  if (constants.IS_PROD) {
    return stoppable(
      https.createServer(
        {
          key: fs.readFileSync(constants.APP_SSL_KEY, 'utf-8'),
          cert: fs.readFileSync(constants.APP_SSL_CRT, 'utf-8')
        },
        app
      )
    );
  }
  return stoppable(http.createServer(app));
}

/**
 * Starts Authentication Server.
 */
async function start() {
  try {
    // connect to DB
    await createConnection();
    // create Express application
    const app = express();
    // apply middleware
    app.use(cors({ credentials: true, origin: '*' }));
    app.use(compresion());
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.text());
    app.use(morgan('combined'));
    // add API to Express app
    app.use('/auth', auth);
    app.use('/task', task);
    // create http server
    server = getServer(app);
    // start server
    console.log('Starting application...');
    server.listen(constants.APP_PORT, () => console.log('Application running...'));
  } catch (error) {
    constants.LOGGER.fatal('Could not start application');
    constants.LOGGER.fatal(error);
    process.exit(1);
  }
}

/**
 * Shutdowns application.
 */
function shutdown() {
  if (server) {
    server.stop((error) => {
      if (error) {
        constants.LOGGER.fatal('Could not stop HTTP server');
        constants.LOGGER.fatal(error);
        process.exit(1);
      }
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start();
