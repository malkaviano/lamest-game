import { ConverterHelper } from '@helpers/converter.helper';
import { KeyValueInterface } from '@interfaces/key-value.interface';
import { ArrayView } from '@wrappers/array.view';
import { ResourcesStore } from './resources.store';

export class ProfessionStore {
  private readonly store: Map<string, ArrayView<string>>;

  constructor(resourcesStore: ResourcesStore) {
    this.store = new Map<string, ArrayView<string>>();

    resourcesStore.professionStore.professions.forEach((profession) => {
      this.store.set(profession.name, ArrayView.fromArray(profession.skills));
    });
  }

  public get professions(): KeyValueInterface<ArrayView<string>> {
    return ConverterHelper.mapToKeyValueInterface(this.store);
  }
}
