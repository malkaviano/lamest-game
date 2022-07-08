import { ActionSelection } from './action-selection.definition';

export class Actionable {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly brief: string,
    public readonly long: string,
    public readonly actions: ActionSelection[]
  ) {}
}
