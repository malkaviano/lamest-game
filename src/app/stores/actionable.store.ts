import { Injectable } from '@angular/core';

import {
  ActionableDefinition,
  createActionableDefinition,
} from '../definitions/actionable.definition';
import { ConverterHelper } from '../helpers/converter.helper';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { ActionableLiteral } from '../literals/actionable.literal';

import actionableStore from '../../assets/actionables.json';

@Injectable({
  providedIn: 'root',
})
export class ActionableStore {
  private readonly store: Map<string, ActionableDefinition>;

  constructor(private readonly converterHelper: ConverterHelper) {
    this.store = new Map<string, ActionableDefinition>();

    actionableStore.actionables.forEach((actionable) => {
      this.store.set(
        actionable.name,
        createActionableDefinition(
          actionable.actionable as ActionableLiteral,
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