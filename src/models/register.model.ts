import { DocumentData } from 'firebase/firestore/lite';

export default interface Register {
    key: string;
    value: number;
}

const registerConverter = {
    toFirestore(register: Register): Register {
        return {
            key: register.key,
            value: register.value,
        };
    },
    fromFirestore(snapshot: DocumentData): Register {
        const data = snapshot.data();
        return {
            key: data.key,
            value: data.value,
        };
    },
};

export { registerConverter };
