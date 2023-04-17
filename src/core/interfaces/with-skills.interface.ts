import { KeyValueInterface } from './key-value.interface';

export interface WithSkillsInterface {
  get skills(): KeyValueInterface<number>;
}
