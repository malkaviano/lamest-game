import { MessageMapDefinition } from '@definitions/message-map.definition';
import { ConverterHelper } from '@helpers/converter.helper';
import { ResourcesStore } from './resources.store';

type payload = {
  [key: string]: { label: string; answer: string; change?: string };
};

export class MessageStore {
  private readonly store: Map<string, payload>;

  constructor(resourcesStore: ResourcesStore) {
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
    return ConverterHelper.mapToKeyValueInterface(this.store);
  }
}
