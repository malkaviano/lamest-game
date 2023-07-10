import { instance, when } from 'ts-mockito';

import { SequencerHelper } from './sequencer.helper';
import { DirectionLiteral } from '../literals/direction.literal';

import { mockedRandomIntHelper } from '../../../tests/mocks';

describe('SequencerHelper', () => {
  const service = new SequencerHelper(instance(mockedRandomIntHelper));

  describe('generating lock picking sequence', () => {
    it('return sequence', () => {
      when(mockedRandomIntHelper.getRandomInterval(0, 1))
        .thenReturn(0)
        .thenReturn(0)
        .thenReturn(1)
        .thenReturn(1);

      const expected: DirectionLiteral[] = ['LEFT', 'DOWN', 'RIGHT', 'UP'];

      const result = service.lockPickSequence(4);

      expect(result).toEqual(expected);
    });
  });
});
