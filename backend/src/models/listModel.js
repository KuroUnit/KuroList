import { db, FieldValue } from '../config/firebaseConfig.js';

const listsCollection = db.collection('lists');

export const listModel = {
  create: async ({ userId, name, mangas = [] }) => {
    const listData = { userId, name, mangas, createdAt: new Date().toISOString() };
    const docRef = await listsCollection.add(listData);
    return { id: docRef.id, ...listData };
  },

  findByUser: async (userId) => {
    const snapshot = await listsCollection.where('userId', '==', userId).get();
    if (snapshot.empty) return [];
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  deleteById: async ({ listId, userId }) => {
    const docRef = listsCollection.doc(listId);
    const doc = await docRef.get();
    if (!doc.exists || doc.data().userId !== userId) {
      throw new Error('Lista não encontrada ou acesso não permitido.');
    }
    const listDel = { id: doc.id, ...doc.data() };
    await docRef.delete();
    return listDel;
  },

  update: async ({ listId, userId, manga, operation = 'add' }) => {
    const docRef = listsCollection.doc(listId);
    const doc = await docRef.get();

    if (!doc.exists || doc.data().userId !== userId) {
      throw new Error('Lista não encontrada ou acesso não permitido.');
    }

    if (operation === 'add') {
      // Adiciona o 'manga' ao array.
      await docRef.update({ mangas: FieldValue.arrayUnion(manga) });
    } else if (operation === 'remove') {
      // Remove o 'manga' do array.
      await docRef.update({ mangas: FieldValue.arrayRemove(manga) });
    } else {
      throw new Error('Operação de atualização inválida.');
    }
    
    // Retorna a lista atualizada
    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  },
};