import { RequestHandler } from 'express';

const notFoundHandler: RequestHandler = (req, res) => {
    return res.status(404).send('Page Not Found');
};

export default notFoundHandler;
