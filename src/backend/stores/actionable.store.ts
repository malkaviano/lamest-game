import {
  ActionableDefinition,
  createActionableDefinition,
} from '@definitions/actionable.definition';
import { ConverterHelper } from '@helpers/converter.helper';
import { ReadonlyKeyValueWrapper } from '@wrappers/key-value.wrapper';
import { ResourcesStore } from '@stores/resources.store';

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

  public get actionables(): ReadonlyKeyValueWrapper<ActionableDefinition> {
    return ConverterHelper.mapToKeyValueInterface(this.store);
  }
}
