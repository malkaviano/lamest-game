import { ActionableDefinition } from './actionable.definition';

export class LogMessage {
  constructor(
    public readonly action: ActionableDefinition,
    public readonly response: string
  ) {}
}
