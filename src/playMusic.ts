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

export function playMusic(newMember: VoiceState, url: string) {
  const connection = joinVoiceChannel({
    guildId: newMember.guild.id,
    channelId: newMember.channelId ?? '',
    adapterCreator: newMember.guild
      .voiceAdapterCreator as DiscordGatewayAdapterCreator,
    selfDeaf: true,
    selfMute: false,
  });
  const player = createAudioPlayer();
  connection.subscribe(player);
  console.log(newMember.member?.user.username);
  const stream = ytdl(ytdl.getURLVideoID(url), {
    filter: (format) =>
      format.audioCodec === 'opus' && format.container === 'webm',
    quality: 'highestaudio',
    highWaterMark: 32 * 1024 * 1024, // https://github.com/fent/node-ytdl-core/issues/902
  });
  const resource = createAudioResource(stream, {
    inputType: StreamType.WebmOpus,
    inlineVolume: true,
  });
  let editedSong = fluentFfmpeg({ source: stream })
    .toFormat('mp3')
    .setStartTime(43); // set the song start time
  resource.volume?.setVolume(0.5);
  player.play(editedSong as any);
  setTimeout(() => {
    player.stop();
  }, 10000);
}
