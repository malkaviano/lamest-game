import { Injectable } from '@angular/core';

import { KeyValueInterface } from '../interfaces/key-value.interface';
import { ArrayView } from '../views/array.view';
import { ConverterHelper } from '../helpers/converter.helper';

import descriptionStore from '../../assets/descriptions.json';

@Injectable({
  providedIn: 'root',
})
export class DescriptionStore {
  private readonly store: Map<string, ArrayView<string>>;

  constructor(private readonly converterHelper: ConverterHelper) {
    this.store = new Map<string, ArrayView<string>>();

    descriptionStore.descriptions.forEach((item) => {
      this.store.set(item.sceneName, new ArrayView(item.paragraphs));
    });
  }

  public get descriptions(): KeyValueInterface<ArrayView<string>> {
    return this.converterHelper.mapToKeyValueInterface(this.store);
  }
}
