import { DirectionLiteral } from '../literals/direction.literal';
import { RandomIntHelper } from './random-int.helper';

export class SequencerHelper {
  constructor(private readonly randomIntHelper: RandomIntHelper) {}
  public lockPickSequence(complexity: number): DirectionLiteral[] {
    const odd: DirectionLiteral[] = ['LEFT', 'RIGHT'];
    const even: DirectionLiteral[] = ['DOWN', 'UP'];

    const sequence: DirectionLiteral[] = [];

    for (let index = 1; index <= complexity; index++) {
      const roll = this.randomIntHelper.getRandomInterval(0, 1);

      const result = index % 2 ? odd[roll] : even[roll];

      sequence.push(result);
    }

    return sequence;
  }
}
