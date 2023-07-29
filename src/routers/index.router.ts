import { Router } from 'express';
import apiRouter from './api.router';
import notFoundHandler from '../controller/notFound.controller';

const indexRouter = Router();

indexRouter.use('/api', apiRouter);
indexRouter.use('/', notFoundHandler);

export default indexRouter;
