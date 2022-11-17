import { ActionableLiteral } from '../literals/actionable.literal';

export class ActionableDefinition {
  constructor(
    public readonly action: ActionableLiteral,
    public readonly name: string,
    public readonly label: string,
    public readonly interactiveId: string
  ) {}

  public equals(other: ActionableDefinition): boolean {
    return (
      this.action === other.action &&
      this.name === other.name &&
      this.label === other.label &&
      this.interactiveId === other.interactiveId
    );
  }
}

export const actionableDefinitions: {
  [key in ActionableLiteral]: (
    id: string,
    name: string,
    label?: string
  ) => ActionableDefinition;
} = {
  OPEN: (id, name, label) =>
    new ActionableDefinition('OPEN', name, label ?? name, id),
  CLOSE: (id, name, label) =>
    new ActionableDefinition('CLOSE', name, label ?? name, id),
  PICK: (id, name, label) =>
    new ActionableDefinition('PICK', name, label ?? name, id),
  ASK: (id, name, label) =>
    new ActionableDefinition('ASK', name, label ?? name, id),
  SCENE: (id, name, label) =>
    new ActionableDefinition('SCENE', name, label ?? name, id),
};
