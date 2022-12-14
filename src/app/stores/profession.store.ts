import { Injectable } from '@angular/core';
import { ConverterHelper } from '../helpers/converter.helper';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { ArrayView } from '../views/array.view';
import { ResourcesStore } from './resources.store';

@Injectable({
  providedIn: 'root',
})
export class ProfessionStore {
  private readonly store: Map<string, ArrayView<SkillNameLiteral>>;

  constructor(
    private readonly converterHelper: ConverterHelper,
    resourcesStore: ResourcesStore
  ) {
    this.store = new Map<string, ArrayView<SkillNameLiteral>>();

    resourcesStore.professionStore.professions.forEach((profession) => {
      this.store.set(profession.name, new ArrayView(profession.skills));
    });
  }

  public get professions(): KeyValueInterface<ArrayView<SkillNameLiteral>> {
    return this.converterHelper.mapToKeyValueInterface(this.store);
  }
}
