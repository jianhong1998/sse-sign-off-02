import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import databaseConfig from '../../configs/database.config';

// Initialize Firebase
const app = initializeApp(databaseConfig);
const db = getFirestore(app);

export default db;
