import admin from 'firebase-admin';
import {getFirestore} from 'firebase-admin/firestore';
import dotenv from 'dotenv';

import serviceAccount from './firebase-credentials.json' with { type: 'json' };

dotenv.config();


if (admin.apps.length === 0) {
  try {
    console.log('Inicializando o Firebase Admin SDK...');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error('Ocorreu um erro de inicialização do administrador para conexão com o Firebase', error.stack);
  }
}

export const db = getFirestore();