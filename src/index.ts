// load env variables
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import constants from './constants';
import compresion from 'compression';
import cookieParser from 'cookie-parser';

import { auth } from './api';

/**
 * Creates a DB connection.
 */
function createConnection(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    console.log('Connecting to DB...');
    mongoose.connect(constants.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.once('open', () => {
      console.log('Connected to DB');
      resolve(true);
    });
    mongoose.connection.on('error', () => {
      console.error('Could not connect to DB');
      reject(false);
    });
  });
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
    // add API to Express app
    app.use('/auth', auth);
    // start
    app.listen(constants.APP_PORT, () => {
      console.log(`App listening on port ${constants.APP_PORT}...`);
    });
  } catch (error) {
    console.error('Could not start application');
    process.exit(1);
  }
}

start();
