import { SkillDefinition } from '@definitions/skill.definition';
import { ConverterHelper } from '@helpers/converter.helper';
import { ReadonlyKeyValueWrapper } from '@wrappers/key-value.wrapper';
import { ResourcesStore } from '@stores/resources.store';
import { ArrayView } from '@wrappers/array.view';
import { CharacteristicNameLiteral } from '@literals/characteristic-name.literal';

export class SkillStore {
  private readonly store: Map<string, SkillDefinition>;

  constructor(resourcesStore: ResourcesStore) {
    this.store = new Map<string, SkillDefinition>();

    resourcesStore.skillStore.skills.forEach((skill) => {
      const influenced = skill.influenced.map(
        (i) => i as CharacteristicNameLiteral
      );

      this.store.set(
        skill.name,
        new SkillDefinition(
          skill.name,
          skill.description,
          skill.affinity,
          skill.combat,
          influenced
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
