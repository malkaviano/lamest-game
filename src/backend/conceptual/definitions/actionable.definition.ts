import { ActionableLiteral } from '@literals/actionable.literal';
import { GameStringsStore } from '../../stores/game-strings.store';

export class ActionableDefinition {
  constructor(
    public readonly actionable: ActionableLiteral,
    public readonly name: string,
    public readonly label: string
  ) {}

  public equals(other: ActionableDefinition): boolean {
    return (
      this.actionable === other.actionable &&
      this.name === other.name &&
      this.label === other.label
    );
  }
}

export const createActionableDefinition = (
  key: ActionableLiteral,
  name: string,
  label?: string
) => new ActionableDefinition(key, name, label ?? name);

export const affectActionable = createActionableDefinition(
  'AFFECT',
  'affect',
  GameStringsStore.descriptions['ATTACK']
);

export const consumeActionable = createActionableDefinition(
  'CONSUME',
  'consume',
  'Consume'
);

export const equipActionable = createActionableDefinition(
  'EQUIP',
  'equip',
  'Equip'
);

export const readActionable = createActionableDefinition(
  'READ',
  'read',
  'Read'
);

export const dropActionable = createActionableDefinition(
  'DROP',
  'drop',
  'Drop'
);

export const unequipActionable = createActionableDefinition(
  'UNEQUIP',
  'unequip',
  'Unequip'
);

export const wearActionable = createActionableDefinition(
  'WEAR',
  'wear',
  'Wear'
);

export const stripActionable = createActionableDefinition(
  'STRIP',
  'strip',
  'Strip'
);
