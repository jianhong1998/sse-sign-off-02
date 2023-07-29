import { collection } from 'firebase/firestore/lite';
import { registerConverter } from '../../models/register.model';
import db from './database.service';

const registerCollection = collection(db, 'register').withConverter(
    registerConverter,
);
export { registerCollection };
