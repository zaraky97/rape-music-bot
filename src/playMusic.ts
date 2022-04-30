import {
  createAudioPlayer,
  createAudioResource,
  DiscordGatewayAdapterCreator,
  joinVoiceChannel,
  StreamType,
} from '@discordjs/voice';
import { VoiceState } from 'discord.js';
import ytdl from 'ytdl-core';
import fluentFfmpeg from 'fluent-ffmpeg';
import ffmpeg_static from 'ffmpeg-static';

export function playMusic(
  newMember: VoiceState,
  musicdata: {
    urls: string[];
    start: number;
    duration: number;
  }
) {
  const connection = joinVoiceChannel({
    guildId: newMember.guild.id,
    channelId: newMember.channelId ?? '',
    adapterCreator: newMember.guild
      .voiceAdapterCreator as DiscordGatewayAdapterCreator,
    selfDeaf: true,
    selfMute: false,
  });
  try {
    const player = createAudioPlayer();
    connection.subscribe(player);
    const stream = ytdl(ytdl.getURLVideoID(musicdata.urls[0]), {
      filter: 'audioonly',
      highWaterMark: 1 << 62,
      liveBuffer: 1 << 62,
      dlChunkSize: 0, //disabling chunking is recommended in discord bot
      quality: 'lowestaudio',
    });
    fluentFfmpeg.setFfmpegPath(ffmpeg_static);
    const editedSong = fluentFfmpeg({ source: stream })
      .toFormat('mp3')
      .setStartTime(musicdata.start ?? 0);
    const resource = createAudioResource(editedSong as any, {
      inputType: StreamType.Arbitrary,
      inlineVolume: true,
    });
    resource.volume?.setVolume(0.3);
    player.play(resource);
    setTimeout(() => {
      player.stop();
    }, musicdata.duration * 1000 ?? 10000);
  } catch (e) {
    console.log(e);
  }
}
