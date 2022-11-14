import { ActionSelected } from '../definitions/action-selected.definition';

export class InteractiveEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly actions: ActionSelected[]
  ) {}
}
