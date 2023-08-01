import { RequestHandler } from 'express';
import {
    addNumberToRegister,
    deleteRegister,
    getRegister,
    resetRegister,
} from '../services/register/register.service';
import { getErrorMessage } from '../services/error/error.service';
import sendResponseService from '../services/response/sendResponse.service';

const getRegisterValueRequestHandler: RequestHandler<
    { key: string },
    string
> = async (req, res) => {
    const { key } = req.params;

    console.log(`getRegisterValueRequestHandler(): Receive key "${key}"`);

    try {
        const register = await getRegister(key);

        if (register === null) {
            console.log(`getRegisterValueRequestHandler(): Response "0"`);

            return sendResponseService(res, '0', 200);
        }

        console.log(
            `getRegisterValueRequestHandler(): Response "${register.value}"`,
        );

        return sendResponseService(res, register.value.toString(), 200);
    } catch (error) {
        const errorMessage = getErrorMessage(error);

        console.error(
            `getRegisterValueRequestHandler(): Error - "${errorMessage}"`,
        );
        res.status(500).send(`Server Error: ${errorMessage}`);
    }
};

const resetRegisterRequestHandler: RequestHandler<
    { key: string },
    string,
    string
> = async (req, res) => {
    const inputValue = parseInt(req.body);
    const { key } = req.params;

    console.log(
        `resetRegisterRequestHandler(): Receive Register {key : ${key}, value: ${inputValue}}`,
    );

    try {
        const existingRegister = await getRegister(key);

        if (existingRegister === null) {
            const message = `"${key}" is not registered yet.`;

            console.log(
                `resetRegisterRequestHandler(): Response 404 (key: "${key}")`,
            );

            return sendResponseService(res, message, 404);
        }
    } catch (error) {
        const errorMessage = `Fail to get register: ${getErrorMessage(error)}`;

        console.error(`resetRegisterRequestHandler(): Error - ${errorMessage}`);

        return sendResponseService(res, errorMessage, 500);
    }

    try {
        const register = await resetRegister(key, inputValue);

        console.log(
            `resetRegisterRequestHandler(): Response "${register.value.toString()}"`,
        );

        return sendResponseService(res, register.value.toString(), 200);
    } catch (error) {
        const message = `Fail to reset register: ${getErrorMessage(error)}`;

        console.error(`resetRegisterRequestHandler(): Error - ${message}`);
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
        `addNumberToRegisterRequestHandler(): Receive Register {key: ${key}, value: ${inputValue}}`,
    );

    try {
        const { value: updatedValue } = await addNumberToRegister(key, value);

        console.log(
            `addNumberToRegisterRequestHandler(): Response "${updatedValue}"`,
        );
        return sendResponseService(res, updatedValue.toString(), 200);
    } catch (error) {
        const message = `Fail to add number to register: ${getErrorMessage(
            error,
        )}`;

        console.error(
            `addNumberToRegisterRequestHandler(): Error - ${message}`,
        );

        sendResponseService(res, message, 500);
    }
};

const deleteRegisterRequestHandler: RequestHandler<
    { key: string },
    undefined,
    undefined,
    undefined
> = async (req, res) => {
    const { key } = req.params;

    console.log(`deleteRegisterRequestHandler(): Receive Key "${key}"`);

    try {
        const existingRegister = await getRegister(key);

        if (existingRegister === null) {
            const errorMessage = `"${key}" is not registered yet`;

            console.log(
                `deleteRegisterRequestHandler(): Response 404 (key: ${key})`,
            );

            return sendResponseService(res, errorMessage, 404);
        }
    } catch (error) {
        const errorMessage = `Fail to get register: ${getErrorMessage(error)}`;

        console.error(
            `deleteRegisterRequestHandler(): Error - ${errorMessage}`,
        );

        return sendResponseService(res, errorMessage, 500);
    }

    try {
        await deleteRegister(key);

        console.log(
            `deleteRegisterRequestHandler(): Response 204 (Register deleted successfully)`,
        );

        sendResponseService(res, '', 204);
    } catch (error) {
        const errorMessage = `Fail to delete register: ${getErrorMessage(
            error,
        )}`;

        console.error(
            `deleteRegisterRequestHandler(): Error - ${errorMessage}`,
        );

        sendResponseService(res, errorMessage, 500);
    }
};

export {
    getRegisterValueRequestHandler,
    resetRegisterRequestHandler,
    addNumberToRegisterRequestHandler,
    deleteRegisterRequestHandler,
};
