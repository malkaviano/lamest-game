import { ActionableLiteral } from '@literals/actionable.literal';

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

export const affectActionable = createActionableDefinition('AFFECT', 'affect');

export const consumeActionable = createActionableDefinition(
  'CONSUME',
  'consume'
);

export const equipActionable = createActionableDefinition('EQUIP', 'equip');

export const readActionable = createActionableDefinition('READ', 'read');

export const dropActionable = createActionableDefinition('DROP', 'drop');

export const unequipActionable = createActionableDefinition(
  'UNEQUIP',
  'unequip'
);

export const wearActionable = createActionableDefinition('WEAR', 'wear');

export const stripActionable = createActionableDefinition('STRIP', 'strip');
