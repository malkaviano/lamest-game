import { DirectionLiteral } from '@literals/direction.literal';

export class RandomIntHelper {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  public getRandomInterval(min: number, max: number): number {
    min = Math.trunc(min);
    max = Math.floor(max);
    return Math.trunc(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }

  public lockPickSequence(complexity: number): DirectionLiteral[] {
    const odd: DirectionLiteral[] = ['LEFT', 'RIGHT'];
    const even: DirectionLiteral[] = ['DOWN', 'UP'];

    const sequence: DirectionLiteral[] = [];

    for (let index = 1; index <= complexity; index++) {
      const roll = this.getRandomInterval(0, 1);

      const result = index % 2 ? odd[roll] : even[roll];

      sequence.push(result);
    }

    return sequence;
  }
}
