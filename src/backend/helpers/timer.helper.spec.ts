import { TimerHelper } from '@helpers/timer.helper';
import { ArrayView } from '@wrappers/array.view';

import { setupMocks } from '../../../tests/mocks';

describe('TimerHelper', () => {
  const intervalId = 'test';

  beforeEach(() => {
    setupMocks();
  });

  afterEach(() => {
    TimerHelper.removeInterval(intervalId);
  });

  describe('create', () => {
    it('starts an interval', async () => {
      let result = 0;

      TimerHelper.createInterval(intervalId, () => result++, 100);

      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(result).toEqual(1);
    });
  });

  describe('remove', () => {
    it('stops an interval', async () => {
      let result = 0;

      TimerHelper.createInterval(intervalId, () => result++, 100);

      TimerHelper.removeInterval(intervalId);

      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(result).toEqual(0);
    });
  });

  describe('intervals', () => {
    it('return intervals', async () => {
      TimerHelper.createInterval(intervalId, () => 1 + 1, 100);

      expect(TimerHelper.intervals).toEqual(ArrayView.create(intervalId));
    });
  });
});
