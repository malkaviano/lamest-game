import { ReadonlyKeyValueWrapper } from '@wrappers/key-value.wrapper';

export interface ActorCooldown {
  get cooldowns(): ReadonlyKeyValueWrapper<number>;

  addCooldown(key: string, durationMilliseconds: number): void;
}
