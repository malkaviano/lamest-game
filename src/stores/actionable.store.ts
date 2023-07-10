import {
  ActionableDefinition,
  createActionableDefinition,
} from '@conceptual/definitions/actionable.definition';
import { ConverterHelper } from '@conceptual/helpers/converter.helper';
import { KeyValueInterface } from '@conceptual/interfaces/key-value.interface';
import { ResourcesStore } from './resources.store';

export class ActionableStore {
  private readonly store: Map<string, ActionableDefinition>;

  constructor(resourcesStore: ResourcesStore) {
    this.store = new Map<string, ActionableDefinition>();

    resourcesStore.actionableStore.actionables.forEach((actionable) => {
      this.store.set(
        actionable.key,
        createActionableDefinition(
          actionable.actionable,
          actionable.name,
          actionable.label
        )
      );
    });
  }

  public get actionables(): KeyValueInterface<ActionableDefinition> {
    return ConverterHelper.mapToKeyValueInterface(this.store);
  }
}
