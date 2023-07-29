import { RequestHandler } from 'express';
import {
    addNumberToRegister,
    deleteRegister,
    getRegister,
    resetRegister,
} from '../services/register/register.service';
import { getErrorMessage } from '../services/error/error.service';
import sendResponseService from '../services/response/sendResponse.service';
import Register from '../models/register.model';

const getRegisterValueRequestHandler: RequestHandler<
    { key: string },
    string
> = async (req, res) => {
    const { key } = req.params;

    console.log('receive key: ', key);

    try {
        const register = await getRegister(key);

        if (register === null) {
            return sendResponseService(res, '0', 200);
        }

        // res.status(200).send(register.value);
        return sendResponseService(res, register.value.toString(), 200);
    } catch (error) {
        res.status(500).send(`Server Error: ${getErrorMessage(error)}`);
    }
};

const resetRegisterRequestHandler: RequestHandler<
    { key: string },
    string,
    string
> = async (req, res) => {
    // Something wrong - cannot get the number from body (NaN)
    const inputValue = parseInt(req.body);
    const { key } = req.params;

    try {
        const register = await resetRegister(key, inputValue);

        return sendResponseService(res, register.value.toString(), 200);
    } catch (error) {
        const message = `Fail to reset register: ${getErrorMessage(error)}`;
        return sendResponseService(res, message, 500);
    }
};

const addNumberToRegisterRequestHandler: RequestHandler<
    { key: string },
    string,
    string
> = async (req, res) => {
    const { key } = req.params;
    const inputValue = req.body;
    const value = parseInt(inputValue);

    console.log(
        'Received inputValue = ',
        inputValue,
        '(',
        typeof inputValue,
        ')',
    );

    console.log(`parseInt Value = ${value}`);

    try {
        const { value: updatedValue } = await addNumberToRegister(key, value);

        return sendResponseService(res, updatedValue.toString(), 200);
    } catch (error) {
        const message = `Fail to add number to register: ${getErrorMessage(
            error,
        )}`;

        sendResponseService(res, message, 500);
    }
};

const deleteRegisterRequestHandler: RequestHandler<{ key: string }> = async (
    req,
    res,
) => {
    try {
        const { key } = req.params;

        await deleteRegister(key);
    } catch (error) {
        sendResponseService(res, getErrorMessage(error), 500);
    }
};

export {
    getRegisterValueRequestHandler,
    resetRegisterRequestHandler,
    addNumberToRegisterRequestHandler,
};
