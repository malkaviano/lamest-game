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

  public toString(): string {
    return `${this.actionable} - ${this.label}`;
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
  'Use Equipped'
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
