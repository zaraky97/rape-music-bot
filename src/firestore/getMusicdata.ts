import admin from 'firebase-admin';

export async function getMusicdata(db: admin.firestore.Firestore, userId: string): Promise<{urls: string[], start: number; duration: number} | undefined> {
    const snapshot = await db.collection('users').doc(userId).get();
    const musicData = snapshot.data();
    if (!musicData) {
        console.log('not found')
        return undefined;
    }
    return musicData.music;
}