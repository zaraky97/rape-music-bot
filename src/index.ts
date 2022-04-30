import { Client, Intents } from 'discord.js';
import admin from 'firebase-admin';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import { MEMBER_MUSIC_DATA } from './constants/memberMusicData';
import { getMusicdata } from './firestore/getMusicdata';
import { updateMusic } from './firestore/updateMusic';
import { playMusic } from './playMusic';

require('dotenv').config();

var serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
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

client.on('messageCreate', (msg) => {
  if (msg.content === 'Hello') msg.reply('Hi');
  if (msg.content === 'こんにちは') {
    msg.channel.send('オイッスー！');
  }
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
  if (
    newMember.member?.user.username === 'rape-music-bot' ||
    oldMember.channelId === newMember.channelId
  )
    return;
  if (newMember.channelId) {
    if (!newMember.member?.user.username) return;
    const musicdata = MEMBER_MUSIC_DATA.find(
      (data) => data.username === newMember.member?.user.username
    );
    if (!musicdata) return;
    playMusic(newMember, musicdata);
  } else {
    console.log(`Left voice channel ${newMember.member?.user.username}`);
  }
});
client.login(process.env.DISCORD_TOKEN);
