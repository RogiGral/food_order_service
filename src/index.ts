import express from 'express';
import App from './services/ExpressApp';
import dbConnection from './services/Database';

import { PORT } from './config';

import dotenv from 'dotenv';


dotenv.config({ path: '../.env' })

const StartServer = async () => {

    const app = express();

    await dbConnection()

    await App(app);

    app.listen(PORT, () => {
        console.log(`Listening to port ${process.env.PORT}`);
    })
}

StartServer();