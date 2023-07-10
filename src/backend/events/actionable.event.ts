import { ActionableDefinition } from '@definitions/actionable.definition';

export class ActionableEvent {
  constructor(
    public readonly actionableDefinition: ActionableDefinition,
    public readonly eventId: string
  ) {}
}
