import express from 'express';

import bodyParser from 'body-parser';

import { VendorRoute ,  AdminRoute } from './routes';
import mongoose, { ConnectOptions } from 'mongoose';
import { MONGO_URI } from './config';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/admin",AdminRoute);
app.use("/vendor",VendorRoute);

mongoose.connect(MONGO_URI).then((result) => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});

app.listen(3000, () => {
    console.log('Server is running on port 8000');
});
