import { Router } from 'express';
import {
    addNumberToRegisterRequestHandler,
    getRegisterValueRequestHandler,
    resetRegisterRequestHandler,
} from '../controller/register.controller';

const apiRouter = Router();

apiRouter.get('/:key', getRegisterValueRequestHandler);
apiRouter.put('/:key', resetRegisterRequestHandler);
apiRouter.post('/:key', addNumberToRegisterRequestHandler);
apiRouter.delete('/:key');

export default apiRouter;
