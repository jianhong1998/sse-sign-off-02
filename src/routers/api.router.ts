import { Router } from 'express';
import {
    addNumberToRegisterRequestHandler,
    deleteRegisterRequestHandler,
    getRegisterValueRequestHandler,
    resetRegisterRequestHandler,
} from '../controller/register.controller';

const apiRouter = Router();

apiRouter.get('/:key', getRegisterValueRequestHandler);
apiRouter.put('/:key', resetRegisterRequestHandler);
apiRouter.post('/:key', addNumberToRegisterRequestHandler);
apiRouter.delete('/:key', deleteRegisterRequestHandler);

export default apiRouter;
