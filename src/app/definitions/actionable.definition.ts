import { ActionableLiteral } from '../literals/actionable.literal';

export class ActionableDefinition {
  constructor(
    public readonly name: ActionableLiteral,
    public readonly label: string
  ) {}
}

export const actionableDefinitions: {
  [key in ActionableLiteral]: ActionableDefinition;
} = {
  OPEN: new ActionableDefinition('OPEN', 'Open'),
  CLOSE: new ActionableDefinition('CLOSE', 'Close'),
  PICK: new ActionableDefinition('PICK', 'Pick'),
};
