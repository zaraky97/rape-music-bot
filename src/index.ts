import { Client, Intents } from 'discord.js';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getMusicdata } from './firestore/getMusicdata';
import { updateMusic } from './firestore/updateMusic';
import { playMusic } from './playMusic';

require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECTID,
    clientEmail: process.env.FIREBASE_CLIENTEMAIL,
    privateKey: process.env.FIREBASE_PRIVATEKEY
      ? process.env.FIREBASE_PRIVATEKEY.replace(/\\n/g, '\n')
      : '',
  }),
});

const db = getFirestore();

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

client.on('ready', () => {
  console.log(`${client.user?.tag} でログインしています。`);
});

client.on('messageCreate', async (msg) => {
  const userId = msg.member?.user.id;
  const username = msg.member?.user.username;
  if (msg.content === 'Hello') msg.reply('Hi');
  if (msg.content === 'こんにちは') {
    msg.channel.send('オイッスー！');
  }
  if (msg.content === '!music-help') {
    msg.channel.send(
      '曲の登録・更新\n```!music-update youtubeのurl 始まりの時間(s) 動画の長さ(s)\n例）!music-update https://www.youtube.com/watch?v=upODO6OuOOk 9 15```'
    );
    msg.channel.send('自分が登録した曲の確認\n```!music-me```');
    msg.channel.send('サーバーに登録されている曲の確認\n```!music-list```');
  }
  if (msg.content === '!music-me') {
    if (!userId) return;
    const storeMusicdata = await getMusicdata(db, userId);
    if (!storeMusicdata) {
      msg.channel.send('登場曲が見つからないッス');
    } else {
      msg.channel.send(
        `${username}の登場曲: ${storeMusicdata.urls} ${storeMusicdata.start} ${storeMusicdata.duration}`
      );
    }
  }
  if (msg.content.includes('!music-update')) {
    const msgArray = msg.content.split(' ');
    const msgDataObject = {
      urls: [msgArray[1]],
      start: msgArray[2] ? +msgArray[2] : 0,
      duration: msgArray[3] ? +msgArray[3] : 15,
    };
    if (!userId || !username) return;
    if (username === 'rape-music-bot') return;
    updateMusic(db, userId, username, msgDataObject);
    msg.channel.send(`更新! url: ${msgArray[1]}`);
  }
  // if (msg.content === '!music-stop') {
  //   const player = createAudioPlayer();
  //   player.stop();
  // }
});

client.on('voiceStateUpdate', async (oldMember, newMember) => {
  if (
    newMember.member?.user.username === 'rape-music-bot' ||
    oldMember.channelId === newMember.channelId
  )
    return;
  if (newMember.channelId) {
    if (!newMember.member?.user.username) return;
    const storeMusicdata = await getMusicdata(db, newMember.id.toString());
    if (!storeMusicdata) return;
    playMusic(newMember, storeMusicdata);
  } else {
    console.log(`Left voice channel ${newMember.member?.user.username}`);
  }
});
client.login(process.env.DISCORD_TOKEN);
