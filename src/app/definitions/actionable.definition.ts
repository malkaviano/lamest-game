import { ActionableLiteral } from '../literals/actionable.literal';

export class ActionableDefinition {
  constructor(
    public readonly actionable: ActionableLiteral,
    public readonly name: string,
    public readonly label: string,
    public readonly interactiveId: string
  ) {}

  public equals(other: ActionableDefinition): boolean {
    return (
      this.actionable === other.actionable &&
      this.name === other.name &&
      this.label === other.label &&
      this.interactiveId === other.interactiveId
    );
  }
}

export const createActionableDefinition = (
  key: ActionableLiteral,
  id: string,
  name: string,
  label?: string
) => new ActionableDefinition(key, name, label ?? name, id);
