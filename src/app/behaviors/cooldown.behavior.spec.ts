import { fakeAsync, tick } from '@angular/core/testing';

import { CooldownBehavior } from './cooldown.behavior';

describe('CooldownBehavior', () => {
  describe('canAct', () => {
    it('return true then false', fakeAsync(() => {
      expect(behavior.canAct).toEqual(true);

      expect(behavior.canAct).toEqual(false);

      tick(500);

      expect(behavior.canAct).toEqual(true);

      tick(1000);
    }));
  });
});

const behavior = CooldownBehavior.create(500);
