import { Response } from 'express';

const sendResponseService = (
    response: Response,
    message: string,
    status: number,
): Response => {
    return response
        .status(status)
        .header({ 'Content-Type': 'text/plain' })
        .send(message);
};

export default sendResponseService;
