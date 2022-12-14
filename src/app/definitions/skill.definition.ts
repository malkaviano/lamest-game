import { CharacteristicSetDefinition } from './characteristic-set.definition';
import { SkillAffinityLiteral } from '../literals/skill-category.literal';
import { KeyValueInterface } from '../interfaces/key-value.interface';

export class SkillDefinition {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly affinity: SkillAffinityLiteral,
    public readonly combat: boolean,
    private readonly baseGenerator: (
      characteristics: CharacteristicSetDefinition
    ) => number
  ) {}

  public base(characteristics: CharacteristicSetDefinition): number {
    return this.baseGenerator(characteristics);
  }
}

const justStr = (characteristics: CharacteristicSetDefinition) =>
  characteristics.STR.value;

const justAgi = (characteristics: CharacteristicSetDefinition) =>
  characteristics.AGI.value;

const justInt = (characteristics: CharacteristicSetDefinition) =>
  characteristics.INT.value;

const justEsn = (characteristics: CharacteristicSetDefinition) =>
  characteristics.ESN.value;

const justApp = (characteristics: CharacteristicSetDefinition) =>
  characteristics.APP.value;

const justVit = (characteristics: CharacteristicSetDefinition) =>
  characteristics.VIT.value;

export const influencedDefinitions: KeyValueInterface<
  (characteristics: CharacteristicSetDefinition) => number
> = {
  justStr,

  justAgi,

  justInt,

  justEsn,

  justApp,

  justVit,

  strPlusAgi: (characteristics: CharacteristicSetDefinition) =>
    justStr(characteristics) + justAgi(characteristics),

  intPlusEsn: (characteristics: CharacteristicSetDefinition) =>
    justInt(characteristics) + justEsn(characteristics),

  intPlusApp: (characteristics: CharacteristicSetDefinition) =>
    justInt(characteristics) + justApp(characteristics),

  doubleDex: (characteristics: CharacteristicSetDefinition) =>
    justAgi(characteristics) * 2,
};
