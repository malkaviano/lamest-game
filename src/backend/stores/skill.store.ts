import { CharacteristicValues } from '@values/characteristic.value';
import { SkillDefinition } from '@definitions/skill.definition';
import { ConverterHelper } from '@helpers/converter.helper';
import { ReadonlyKeyValueWrapper } from '@wrappers/key-value.wrapper';
import { ResourcesStore } from './resources.store';
import { ArrayView } from '@wrappers/array.view';

export class SkillStore {
  private readonly store: Map<string, SkillDefinition>;

  constructor(resourcesStore: ResourcesStore) {
    this.store = new Map<string, SkillDefinition>();

    resourcesStore.skillStore.skills.forEach((skill) => {
      const r = skill.influenced.reduce(
        (acc, f) => {
          return (characteristics: CharacteristicValues) =>
            acc(characteristics) + influencedDefinitions[f](characteristics);
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_: CharacteristicValues): number => {
          return 0;
        }
      );

      this.store.set(
        skill.name,
        new SkillDefinition(
          skill.name,
          skill.description,
          skill.affinity,
          skill.combat,
          r
        )
      );
    });
  }

  public get skills(): ReadonlyKeyValueWrapper<SkillDefinition> {
    return ConverterHelper.mapToKeyValueInterface(this.store);
  }

  public get naturalSkills(): ArrayView<string> {
    return ArrayView.fromArray(
      Object.entries(this.skills)
        .filter(([, value]) => value.affinity === 'NATURAL')
        .map((kv) => kv[0])
    );
  }
}

const str = (characteristics: CharacteristicValues) =>
  characteristics.STR.value;

const agi = (characteristics: CharacteristicValues) =>
  characteristics.AGI.value;

const int = (characteristics: CharacteristicValues) =>
  characteristics.INT.value;

const esn = (characteristics: CharacteristicValues) =>
  characteristics.ESN.value;

const app = (characteristics: CharacteristicValues) =>
  characteristics.APP.value;

const vit = (characteristics: CharacteristicValues) =>
  characteristics.VIT.value;

const influencedDefinitions: ReadonlyKeyValueWrapper<
  (characteristics: CharacteristicValues) => number
> = {
  str,

  agi,

  int,

  esn,

  app,

  vit,
};
