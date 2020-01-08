import { getRandomInt, Distribution } from "./random";
const { generate } = require("lazy.js");
const Midi = require("jsmidgen");

interface Score {
  melody: { pitches: string[] };
  accompaniment: { chord?: string[]; duration: number }[];
}

export function compose(
  score: Score,
  durationDist: Distribution,
  pitchDist: Distribution,
  complexity: number
): typeof Midi.File {
  const file = new Midi.File();

  file.addTrack(
    score.accompaniment.reduce(
      (t, e) =>
        "chord" in e
          ? t.addChord(0, e.chord, (512 / 16) * (e.duration / 0.25))
          : t.noteOff(0, "", (512 / 16) * (e.duration / 0.25)),
      new Midi.Track()
    )
  );

  const duration =
    (512 / 16) *
    (score.accompaniment.reduce((t, { duration: d }) => t + d, 0) / 0.25);

  for (let i = 0; i < complexity; i++) {
    const seq = generate(
      () => 512 / Math.pow(2, getRandomInt(0, 5, durationDist))
    ).memoize();

    file.addTrack(
      seq
        .takeWhile((d, i) => seq.take(i).reduce((a, b) => a + b, d) < duration)
        .reduce((t, d) => {
          const pitches = score.melody.pitches;
          const n = getRandomInt(0, pitches.length, pitchDist);
          const pitch = pitches[n].replace("6", `${6 - i}`);

          return t.addNote(0, pitch, d);
        }, new Midi.Track())
    );
  }
  return file;
}
