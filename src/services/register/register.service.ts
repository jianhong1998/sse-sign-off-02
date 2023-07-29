import {
    getDocs,
    setDoc,
    getDoc,
    deleteDoc,
    updateDoc,
    addDoc,
    doc,
    where,
    query,
} from 'firebase/firestore/lite';

import Register from '../../models/register.model';
import { registerCollection } from '../database/collectionReferences';
import { getErrorMessage } from '../error/error.service';

const getAllRegisters = async (): Promise<Register[]> => {
    const snapshot = await getDocs(registerCollection);

    const data = snapshot.docs
        .filter((doc) => doc.exists())
        .map((doc) => {
            return doc.data();
        });

    return data;
};

const getRegister = async (key: string): Promise<Register | null> => {
    return new Promise(async (resolve, reject) => {
        try {
            const registerQuery = query(
                registerCollection,
                where('key', '==', key),
            );

            const querySnapshot = await getDocs(registerQuery);

            const registerArray = querySnapshot.docs.map((doc) => doc.data());

            if (registerArray.length === 0) {
                return resolve(null);
            }

            if (registerArray.length !== 1) {
                throw new Error(
                    'More than 1 register with same key found in database',
                );
            }

            return resolve(registerArray[0]);
        } catch (error) {
            return reject(error);
        }
    });
};

const createRegister = async (
    key: string,
    value: number,
): Promise<Register> => {
    return new Promise(async (resolve, reject) => {
        try {
            let existingDoc = await getRegister(key);

            if (existingDoc !== null) {
                throw new Error(
                    `Fail to Create Register: Register with key (${key}) is existed.`,
                );
            }

            const data: Register = {
                key,
                value,
            };

            const docRef = await addDoc(registerCollection, data);

            const docSnapshot = await getDoc(docRef);

            existingDoc = docSnapshot.data() || null;

            if (existingDoc === null) {
                throw new Error(
                    'Fail to Create Register: Register is not created after sending request to database.',
                );
            }

            resolve(existingDoc);
        } catch (error) {
            reject(error);
        }
    });
};

const resetRegister = async (key: string, value: number): Promise<Register> => {
    return new Promise(async (resolve, reject) => {
        const data: Register = {
            key,
            value,
        };

        const queryRef = query(registerCollection, where('key', '==', key));

        try {
            const querySnapshot = await getDocs(queryRef);

            const existingDocs = querySnapshot.docs;

            if (existingDocs.length === 0) {
                return reject('Register is not exists');
            }

            const docRef = doc(registerCollection, existingDocs[0].id);

            await updateDoc(docRef, data);
        } catch (error) {
            const errorMessage = getErrorMessage(error);

            return reject(`Fail to update document: ${errorMessage}`);
        }

        try {
            const register = await getRegister(key);

            if (register === null) {
                return reject('Register not exist.');
            }

            return resolve(register);
        } catch (error) {
            const errorMessage = getErrorMessage(error);

            return reject(`Fail to get register: ${errorMessage}`);
        }
    });
};

const deleteRegister = async (key: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        const docRef = doc(registerCollection, key);

        try {
            const registerSnapshot = await getDoc(docRef);

            if (!registerSnapshot.exists()) {
                return reject('Key is not registered yet.');
            }
        } catch (error) {
            const errorMessage = `Fail to get document: ${getErrorMessage(
                error,
            )}`;

            return reject(errorMessage);
        }

        try {
            await deleteDoc(docRef);
            resolve();
        } catch (error) {
            const errorMessage = `Fail to delete document: ${getErrorMessage(
                error,
            )}`;
            reject(errorMessage);
        }
    });
};

const addNumberToRegister = async (
    key: string,
    numberToAdd: number,
): Promise<Register> => {
    return new Promise(async (resolve, reject) => {
        let finalNumber: number = numberToAdd;

        let currentRegister: Register | null;

        try {
            currentRegister = await getRegister(key);

            if (currentRegister === null) {
                const createdRegister = await createRegister(key, finalNumber);

                return resolve(createdRegister);
            }

            finalNumber += currentRegister.value;
        } catch (error) {
            return reject(`Fail to get register: ${getErrorMessage(error)}`);
        }

        try {
            const updatedRegister = await resetRegister(key, finalNumber);

            return resolve(updatedRegister);
        } catch (error) {
            return reject(`Fail to update document: ${getErrorMessage(error)}`);
        }
    });
};

export {
    getAllRegisters,
    getRegister,
    createRegister,
    resetRegister,
    deleteRegister,
    addNumberToRegister,
};
