import { db } from '../config/firebaseConfig.js';
import bcrypt from 'bcrypt';

// Criando uma referência
const usersCollection = db.collection('users');

// Modelo que será ultilizado nas rotas
export const userModel = {
  findByLogin: async (login) => {
    const snapshot = await usersCollection.where('login', '==', login).limit(1).get();
    if (snapshot.empty) return null;
    const userDoc = snapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() }; 
  },
  validatePassword: async (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
  },
};