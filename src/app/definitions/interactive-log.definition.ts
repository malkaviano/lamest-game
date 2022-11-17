import { ActionLogDefinition } from './action-log.definition';

export class InteractiveLogDefinition {
  constructor(
    public readonly interactiveName: string,
    public readonly actionLog: ActionLogDefinition
  ) {}
}
