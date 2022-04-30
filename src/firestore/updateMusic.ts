import admin from 'firebase-admin';
import { getInfo } from 'ytdl-core';

export async function updateMusic(
  db: admin.firestore.Firestore,
  userId: string,
  name: string,
  updateMusicParams: { urls: string[]; start?: number; duration?: number }
) {
  try {
    const info = await getInfo(updateMusicParams.urls[0]);
    console.log(info);
    await db
      .collection('users')
      .doc(userId)
      .set({ name, music: updateMusicParams });
  } catch (e) {
    console.error(e);
  }
}
