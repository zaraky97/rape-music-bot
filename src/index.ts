import { Client, Intents } from 'discord.js';
import { playMusic } from './playMusic';
import { setMusicUrl } from './setMusicUrl';
require('dotenv').config();

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

client.on('voiceStateUpdate', async (oldMember, newMember) => {
  if (
    (newMember.member?.user.username === process.env.DISCORD_BONSAI_NAME ||
      newMember.member?.user.username === process.env.DISCORD_ZARAKY_NAME ||
      newMember.member?.user.username === process.env.DISCORD_HOZ_NAME ||
      newMember.member?.user.username === process.env.DISCORD_TAMA_NAME ||
      newMember.member?.user.username === process.env.DISCORD_IKEDA_NAME ||
      newMember.member?.user.username === process.env.DISCORD_MYRICA_NAME ||
      newMember.member?.user.username === process.env.DISCORD_CHASO_NAME ||
      newMember.member?.user.username === process.env.DISCORD_SoIo_NAME ||
      newMember.member?.user.username === process.env.DISCORD_KANBAKU_NAME ||
      oldMember.member?.user.username !== newMember.member?.user.username) &&
    newMember.channelId
  ) {
    if (!newMember.member?.user.username) return;
    const url = setMusicUrl(newMember.member?.user.username);
    if (!url) return;
    playMusic(newMember, url);
  } else {
    console.log(`Left voice channel ${newMember.member?.user.username}`);
  }
});
client.login(process.env.DISCORD_TOKEN);
