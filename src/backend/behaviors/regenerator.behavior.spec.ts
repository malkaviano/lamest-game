import { RegeneratorBehavior } from '@behaviors/regenerator.behavior';
import { SettingsStore } from '@stores/settings.store';

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

      await new Promise((resolve) =>
        setTimeout(
          resolve,
          SettingsStore.settings.actionPoints.regeneration
            .intervalMilliseconds + 10
        )
      );

      expect(result).toEqual(
        SettingsStore.settings.actionPoints.regeneration.amount
      );

      b.stopApRegeneration();
    });
  });
});

const behavior = () => new RegeneratorBehavior();
