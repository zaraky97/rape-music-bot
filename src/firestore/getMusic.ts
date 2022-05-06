import admin from 'firebase-admin';

export async function getMusic(
  db: admin.firestore.Firestore,
  collectionName: string,
  documentId: string
): Promise<any | undefined> {
  const snapshot = await db.collection(collectionName).doc(documentId).get();
  const musicData = snapshot.data();
  if (!musicData) {
    console.log('not found');
    return undefined;
  }
  return musicData;
}
