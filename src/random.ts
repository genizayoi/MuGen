import { Random, MersenneTwister19937 } from "random-js";
const { generate } = require("lazy.js");

const engine = MersenneTwister19937.seedWithArray([0x12345678, 0x90abcdef]);

const random: Random = new Random(engine);

export type Distribution = "uniform" | "normal";

export function getRandomInt(
  min: number,
  max: number,
  distribution: Distribution
): number {
  const uniformRands = generate(() => random.real(0, 1))
    .filter(n => 0 < n && n < 1)
    .memoize();
  switch (distribution) {
    case "normal": {
      return Math.floor(Math.abs(uniformRands.first()) * (max - min)) + min;
    }
    case "uniform": {
      const pseudoNormalRandomInt =
        uniformRands.take(10).reduce((a: number, b: number) => a + b, 0) / 10;
      return Math.floor(Math.abs(pseudoNormalRandomInt) * (max - min)) + min;
    }
  }
}
