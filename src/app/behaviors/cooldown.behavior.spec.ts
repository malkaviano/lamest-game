import { CooldownBehavior } from './cooldown.behavior';

describe('CooldownBehavior', () => {
  it('should create an instance', () => {
    expect(CooldownBehavior.create(2000)).toBeTruthy();
  });
});
