import { CooldownBehavior } from '@behaviors/cooldown.behavior';

import { setupMocks } from '../../../tests/mocks';

let behavior: CooldownBehavior;

describe('CooldownBehavior', () => {
  beforeEach(() => {
    setupMocks();

    behavior = new CooldownBehavior(100);
  });

  afterEach(() => {
    behavior.stopTimer();
  });

  it('should create an instance', () => {
    expect(behavior).toBeTruthy();
  });

  describe('cooldowns', () => {
    it('return current cooldowns', () => {
      behavior.addCooldown('Dodge', 30);

      expect(behavior.cooldowns).toEqual({ Dodge: 30 });
    });

    it('diminish cooldowns', async () => {
      behavior.addCooldown('Detect', 190);

      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(behavior.cooldowns).toEqual({ Detect: 90 });
    });

    it('remove expired cooldowns', async () => {
      behavior.addCooldown('Disguise', 90);

      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(behavior.cooldowns).toEqual({});
    });
  });
});
