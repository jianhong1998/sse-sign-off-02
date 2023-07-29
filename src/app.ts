import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import indexRouter from './routers/index.router';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '3000');

const NODE_ENV = process.env.NODE_ENV || 'dev';

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text({ type: 'text/plain' }));

app.use('/', indexRouter);

app.listen(port, () => {
    console.log('App is running on port', port);
});
