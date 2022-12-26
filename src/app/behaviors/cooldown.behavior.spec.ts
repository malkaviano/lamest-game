import { fakeAsync, tick } from '@angular/core/testing';

import { CooldownBehavior } from './cooldown.behavior';

describe('CooldownBehavior', () => {
  it('should throw', () => {
    const b = behavior();

    expect(b.canAct).toEqual(true);

    b.acted();

    expect(() => b.acted()).toThrowError('Wrong action executed');
  });

  it('should set cooldown', fakeAsync(() => {
    const b = behavior();

    expect(b.canAct).toEqual(true);

    b.acted();

    expect(b.canAct).toEqual(false);

    tick(600);

    expect(b.canAct).toEqual(true);
  }));
});

const behavior = () => CooldownBehavior.create(500);
