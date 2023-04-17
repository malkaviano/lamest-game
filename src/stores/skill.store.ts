import { Injectable } from '@angular/core';

import { CharacteristicSetDefinition } from '../core/definitions/characteristic-set.definition';
import { SkillDefinition } from '../core/definitions/skill.definition';
import { ConverterHelper } from '../backend/helpers/converter.helper';
import { KeyValueInterface } from '../core/interfaces/key-value.interface';
import { ResourcesStore } from './resources.store';
import { ArrayView } from '../core/view-models/array.view';

@Injectable({
  providedIn: 'root',
})
export class SkillStore {
  private readonly store: Map<string, SkillDefinition>;

  constructor(
    private readonly converterHelper: ConverterHelper,
    resourcesStore: ResourcesStore
  ) {
    this.store = new Map<string, SkillDefinition>();

    resourcesStore.skillStore.skills.forEach((skill) => {
      const r = skill.influenced.reduce(
        (acc, f) => {
          return (characteristics: CharacteristicSetDefinition) =>
            acc(characteristics) + influencedDefinitions[f](characteristics);
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_: CharacteristicSetDefinition): number => {
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

  public get skills(): KeyValueInterface<SkillDefinition> {
    return this.converterHelper.mapToKeyValueInterface(this.store);
  }

  public get naturalSkills(): ArrayView<string> {
    return ArrayView.create(
      Object.entries(this.skills)
        .filter(([, value]) => value.affinity === 'NATURAL')
        .map((kv) => kv[0])
    );
  }
}

const str = (characteristics: CharacteristicSetDefinition) =>
  characteristics.STR.value;

const agi = (characteristics: CharacteristicSetDefinition) =>
  characteristics.AGI.value;

const int = (characteristics: CharacteristicSetDefinition) =>
  characteristics.INT.value;

const esn = (characteristics: CharacteristicSetDefinition) =>
  characteristics.ESN.value;

const app = (characteristics: CharacteristicSetDefinition) =>
  characteristics.APP.value;

const vit = (characteristics: CharacteristicSetDefinition) =>
  characteristics.VIT.value;

const influencedDefinitions: KeyValueInterface<
  (characteristics: CharacteristicSetDefinition) => number
> = {
  str,

  agi,

  int,

  esn,

  app,

  vit,
};
