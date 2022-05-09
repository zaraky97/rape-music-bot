import {
  AudioPlayer,
  createAudioResource,
  StreamType,
  VoiceConnection,
} from '@discordjs/voice';
import ytdl from 'ytdl-core';
import fluentFfmpeg from 'fluent-ffmpeg';
import ffmpeg_static from 'ffmpeg-static';

export function playMusic(
  connection: VoiceConnection,
  audioPlayer: AudioPlayer,
  musicdata: {
    urls: string[];
    start?: number;
    duration?: number;
  }
) {
  try {
    connection.subscribe(audioPlayer);
    console.log('1111111');
    const stream = ytdl(ytdl.getURLVideoID(musicdata.urls[0]), {
      filter: 'audioonly',
      highWaterMark: 1 << 62,
      liveBuffer: 1 << 62,
      dlChunkSize: 0, //disabling chunking is recommended in discord bot
      quality: 'lowestaudio',
    });
    console.log('stream', stream);
    fluentFfmpeg.setFfmpegPath(ffmpeg_static);
    const editedSong = fluentFfmpeg({ source: stream })
      .toFormat('mp3')
      .setStartTime(musicdata.start ?? 0)
      .setDuration(musicdata.duration ? musicdata.duration * 1000 : 10000);
    const resource = createAudioResource(editedSong as any, {
      inputType: StreamType.Arbitrary,
      inlineVolume: true,
    });
    resource.volume?.setVolume(0.3);
    audioPlayer.play(resource);
  } catch (e) {
    console.log(e);
  }
}
