import { Injectable } from '@angular/core';

import {
  ActionableDefinition,
  createActionableDefinition,
} from '../../core/definitions/actionable.definition';
import { ConverterHelper } from '../helpers/converter.helper';
import { KeyValueInterface } from '../../core/interfaces/key-value.interface';
import { ResourcesStore } from './resources.store';

@Injectable({
  providedIn: 'root',
})
export class ActionableStore {
  private readonly store: Map<string, ActionableDefinition>;

  constructor(
    private readonly converterHelper: ConverterHelper,
    resourcesStore: ResourcesStore
  ) {
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
    return this.converterHelper.mapToKeyValueInterface(this.store);
  }
}
