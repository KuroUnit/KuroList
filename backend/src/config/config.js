import admin from 'firebase-admin';
import {getFirestore} from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

if (admin.apps.length === 0) {
  try {
    console.log('Inicializando o Firebase Admin SDK...');
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CREDENTIALS)),
    });
  } catch (error) {
    console.error('Ocorreu um erro de inicialização do administrador para conexão com o Firebase', error.stack);
  }
}

export const db = getFirestore();