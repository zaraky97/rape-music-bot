import admin from 'firebase-admin';
import { getInfo } from 'ytdl-core';

export async function updateMusic(
  db: admin.firestore.Firestore,
  collectionName: string,
  documentId: string,
  updateMusicParams: any
) {
  try {
    await db.collection(collectionName).doc(documentId).set(updateMusicParams);
  } catch (e) {
    console.error(e);
  }
}
