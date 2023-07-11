import { KeyValueInterface } from '@interfaces/key-value.interface';

export interface WithSkillsInterface {
  get skills(): KeyValueInterface<number>;
}
