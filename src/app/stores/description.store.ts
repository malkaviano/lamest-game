import { Injectable } from '@angular/core';

import { KeyValueInterface } from '../interfaces/key-value.interface';
import { ArrayView } from '../views/array.view';

import descriptionStore from '../../assets/descriptions.json';

@Injectable({
  providedIn: 'root',
})
export class DescriptionStore {
  private readonly store: Map<string, string[]>;

  constructor() {
    this.store = new Map<string, string[]>();

    descriptionStore.descriptions.forEach((item) => {
      this.store.set(item.sceneName, item.paragraphs);
    });
  }

  public get descriptions(): KeyValueInterface<ArrayView<string>> {
    return Array.from(this.store.entries()).reduce((acc: any, [k, v]) => {
      acc[k] = new ArrayView(v);

      return acc;
    }, {});
  }
}
