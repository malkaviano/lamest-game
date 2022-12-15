import { Injectable } from '@angular/core';

import {
  influencedDefinitions,
  SkillDefinition,
} from '../definitions/skill.definition';
import { ConverterHelper } from '../helpers/converter.helper';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { ArrayView } from '../views/array.view';
import { ResourcesStore } from './resources.store';

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
      this.store.set(
        skill.name,
        new SkillDefinition(
          skill.name,
          skill.description,
          skill.affinity,
          skill.combat,
          influencedDefinitions[skill.influenced]
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
