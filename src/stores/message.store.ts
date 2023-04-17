import { Injectable } from '@angular/core';

import { MessageMapDefinition } from '../core/definitions/message-map.definition';
import { ConverterHelper } from '../backend/helpers/converter.helper';
import { ResourcesStore } from './resources.store';

type payload = {
  [key: string]: { label: string; answer: string; change?: string };
};

@Injectable({
  providedIn: 'root',
})
export class MessageStore {
  private readonly store: Map<string, payload>;

  constructor(
    resourcesStore: ResourcesStore,
    private readonly converterHelper: ConverterHelper
  ) {
    this.store = new Map<string, payload>();

    resourcesStore.messageStore.messages.forEach(({ id, options }) => {
      const mapOptions = options.reduce(
        (mapOptions: payload, { name, label, answer, change }) => {
          mapOptions[name] = { label, answer, change };

          return mapOptions;
        },
        {}
      );

      this.store.set(id, mapOptions);
    });
  }

  public get messages(): MessageMapDefinition {
    return this.converterHelper.mapToKeyValueInterface(this.store);
  }
}
