import { Injectable } from '@angular/core';

import {
  ActionableDefinition,
  createActionableDefinition,
} from '../definitions/actionable.definition';
import { ConverterHelper } from '../helpers/converter.helper';
import { KeyValueInterface } from '../interfaces/key-value.interface';

@Injectable({
  providedIn: 'root',
})
export class ActionableStore {
  private readonly store: Map<string, ActionableDefinition>;

  constructor(private readonly converterHelper: ConverterHelper) {
    this.store = new Map<string, ActionableDefinition>();

    this.store.set(
      'sceneExitDoor',
      createActionableDefinition('SCENE', 'sceneExitDoor', 'Exit')
    );

    this.store.set(
      'knife',
      createActionableDefinition('PICK', 'knife', 'Hunting Knife')
    );

    this.store.set(
      'firstAid',
      createActionableDefinition('PICK', 'firstAid', 'First Aid Kit')
    );

    this.store.set(
      'Athleticism',
      createActionableDefinition('SKILL', 'Athleticism')
    );

    this.store.set(
      'enterSceneDoor',
      createActionableDefinition('SCENE', 'enterSceneDoor', 'Enter')
    );

    this.store.set(
      'attack',
      createActionableDefinition('ATTACK', 'attack', 'Attack')
    );

    this.store.set(
      'club',
      createActionableDefinition('PICK', 'club', 'Wood Stick')
    );

    this.store.set(
      'corridorDoor',
      createActionableDefinition('SCENE', 'corridorDoor', 'Enter')
    );

    this.store.set(
      'halberd',
      createActionableDefinition('PICK', 'halberd', 'Halberd')
    );

    this.store.set(
      'bubbleGum',
      createActionableDefinition('PICK', 'bubbleGum', 'Bubble Gum')
    );
  }

  public get actionables(): KeyValueInterface<ActionableDefinition> {
    return this.converterHelper.mapToKeyValueInterface(this.store);
  }
}
