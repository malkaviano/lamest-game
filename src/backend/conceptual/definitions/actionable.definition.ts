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
  name?: string,
  label?: string
) => new ActionableDefinition(key, name ?? key, label ?? name ?? key);

export const affectActionable = createActionableDefinition('AFFECT');

export const consumeActionable = createActionableDefinition('CONSUME');

export const equipActionable = createActionableDefinition('EQUIP');

export const readActionable = createActionableDefinition('READ');

export const dropActionable = createActionableDefinition('DROP');

export const unequipActionable = createActionableDefinition('UNEQUIP');

export const wearActionable = createActionableDefinition('WEAR');

export const stripActionable = createActionableDefinition('STRIP');
