import {compose} from './compose';
import {safeLoad} from 'js-yaml';
import {Distribution} from './random';
import {Buffer} from 'buffer';

const Timidity = require('timidity');

document.addEventListener('DOMContentLoaded', () => {
  let timidity: typeof Timidity;
    document.getElementById('stop')?.addEventListener('click', () => {
      timidity.destroy();
    });
    document.getElementById('play')?.addEventListener('click', async () => {
      const scoreFile = (document.getElementById('scoreFile') as HTMLSelectElement).value;
      const complexity = parseInt((document.getElementById('complexity') as HTMLSelectElement).value);
      const pitchDist = (document.getElementById('pitchDist') as HTMLSelectElement).value as Distribution;
      const durationDist = (document.getElementById('durationDist') as HTMLSelectElement).value as Distribution;
      const response = await fetch(scoreFile);
      const score = safeLoad(await response.text());
      timidity = new Timidity();
      let midi = Buffer.from(compose(score, durationDist, pitchDist, complexity).toBytes(), 'binary');
      timidity.on('ended', () => {
        timidity.load(midi);
      });
      timidity.on('unstarted', () => {
        timidity.play();
        midi = Buffer.from(compose(score, durationDist, pitchDist, complexity).toBytes(), 'binary');
      });
      timidity.load(midi);
    });
});
