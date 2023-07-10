export class RandomIntHelper {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  public getRandomInterval(min: number, max: number): number {
    min = Math.trunc(min);
    max = Math.floor(max);
    return Math.trunc(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }
}
