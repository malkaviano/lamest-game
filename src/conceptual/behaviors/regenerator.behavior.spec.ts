import { RegeneratorBehavior } from './regenerator.behavior';

import { setupMocks } from '../../../tests/mocks';

describe('RegeneratorBehavior', () => {
  beforeEach(() => {
    setupMocks();
  });

  describe('startApRegeneration', () => {
    it('emit event', async () => {
      let result: number | undefined;

      const b = behavior();

      b.apRegenerated$.subscribe((event) => {
        result = event;
      });

      b.startApRegeneration();

      expect(result).toBeUndefined();

      await new Promise((resolve) => setTimeout(resolve, 400));

      expect(result).toEqual(2);

      b.stopApRegeneration();
    });
  });
});

const behavior = () => new RegeneratorBehavior();
