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
    const subscriber = connection.subscribe(audioPlayer);
    const stream = ytdl(ytdl.getURLVideoID(musicdata.urls[0]), {
      filter: 'audioonly',
      highWaterMark: 1 << 62,
      liveBuffer: 1 << 62,
      dlChunkSize: 0, //disabling chunking is recommended in discord bot
      quality: 'lowestaudio',
    });
    let editedSong = undefined;
    if (musicdata.start || musicdata.duration) {
      fluentFfmpeg.setFfmpegPath(ffmpeg_static);
      editedSong = fluentFfmpeg({ source: stream })
        .toFormat('mp3')
        .setStartTime(musicdata.start ?? 0)
        .setDuration(musicdata.duration ? musicdata.duration * 1000 : 10000);
    } else {
      editedSong = stream;
    }
    const resource = createAudioResource(editedSong as any, {
      inputType: StreamType.Arbitrary,
      inlineVolume: true,
    });
    resource.volume?.setVolume(0.3);
    audioPlayer.play(resource);
    audioPlayer.addListener('stateChange', (oldState: any, newState: any) => {
      if (newState.status === 'idle') {
        subscriber?.unsubscribe();
      }
    });
  } catch (e) {
    console.log(e, 'play music');
  }
}
