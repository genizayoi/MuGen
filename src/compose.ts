import {getRandomInt, Distribution} from './random';
const {generate} = require('lazy.js');
const Midi = require('jsmidgen');

interface Score {
  melody: {pitches: string[]};
  accompaniment: {chord?: string[]; duration: number}[];
}

export function compose(score: Score, durationDist: Distribution, pitchDist: Distribution, complexity: number): typeof Midi.File {
  const file = new Midi.File();

  file.addTrack(score
      .accompaniment
      .reduce((track, event)=>(
        'chord' in event ?
          track.addChord(0, event.chord, (512 / 16.00) * (event.duration / 0.25)) :
          track.noteOff(0, '', (512 / 16.00) * (event.duration / 0.25))
      ), new Midi.Track()));

  const duration = (512 / 16.00) * (score.accompaniment.reduce((t, {duration: d})=>t+d, 0) / 0.25);

  for (let i = 0; i < complexity; i++) {
    const seq = generate(()=>512 / Math.pow(2, getRandomInt(0, 5, durationDist))).memoize();

    file.addTrack(seq
        .takeWhile((d: number, i: number)=>seq.first(i).reduce((a: number, b: number) => a + b, d) < duration)
        .reduce((track: typeof Midi.Track, duration: number) => {
          const pitches = score.melody.pitches;
          const pitch = pitches[getRandomInt(0, pitches.length, pitchDist)].replace('6', `${6-i}`);

          return track.addNote(0, pitch, duration);
        }, new Midi.Track()));
  }
  return file;
}
