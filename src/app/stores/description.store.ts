import { Injectable } from '@angular/core';

import { KeyValueInterface } from '../interfaces/key-value.interface';
import { ArrayView } from '../view-models/array.view';
import { ConverterHelper } from '../helpers/converter.helper';
import { ResourcesStore } from './resources.store';

@Injectable({
  providedIn: 'root',
})
export class DescriptionStore {
  private readonly store: Map<string, ArrayView<string>>;

  constructor(
    private readonly converterHelper: ConverterHelper,
    resourcesStore: ResourcesStore
  ) {
    this.store = new Map<string, ArrayView<string>>();

    resourcesStore.descriptionStore.descriptions.forEach((item) => {
      this.store.set(item.sceneName, ArrayView.create(item.paragraphs));
    });
  }

  public get descriptions(): KeyValueInterface<ArrayView<string>> {
    return this.converterHelper.mapToKeyValueInterface(this.store);
  }
}
