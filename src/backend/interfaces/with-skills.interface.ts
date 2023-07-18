import { ReadonlyKeyValueWrapper } from '@wrappers/key-value.wrapper';

export interface WithSkillsInterface {
  get skills(): ReadonlyKeyValueWrapper<number>;
}
