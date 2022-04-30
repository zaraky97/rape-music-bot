import admin from 'firebase-admin';

export async function updateMusic(
  db: admin.firestore.Firestore,
  userId: string,
  name: string,
  updateMusicParams: { urls: string[]; start?: number; duration?: number }
) {
  try {
    await db
      .collection('users')
      .doc(userId)
      .set({ name, music: updateMusicParams });
  } catch (e) {
    console.log(e);
  }
}
