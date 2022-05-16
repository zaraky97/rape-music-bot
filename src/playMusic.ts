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
    const readableStream = ytdl(ytdl.getURLVideoID(musicdata.urls[0]), {
      filter: 'audioonly',
      highWaterMark: 1 << 62,
      liveBuffer: 1 << 62,
      dlChunkSize: 0, //disabling chunking is recommended in discord bot
      quality: 'lowestaudio',
    });
    let editedSong = undefined;
    if (musicdata.start || musicdata.duration) {
      fluentFfmpeg.setFfmpegPath(ffmpeg_static);
      editedSong = fluentFfmpeg({ source: readableStream })
        .toFormat('mp3')
        .setStartTime(musicdata.start ?? 0)
        .setDuration(musicdata.duration ?? 10);
    } else {
      editedSong = readableStream;
    }
    const resource = createAudioResource(editedSong as any, {
      inputType: StreamType.Arbitrary,
      inlineVolume: true,
    });
    resource.volume?.setVolume(0.5);
    audioPlayer.play(resource);
  } catch (e) {
    console.log(e, 'play music');
  }
}
