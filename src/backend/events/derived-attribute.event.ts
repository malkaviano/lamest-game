import { PreviousCurrentEventAbstraction } from '@abstractions/previous-current-event.abstraction';
import { DerivedAttributeNameLiteral } from '@literals/derived-attribute-name.literal';

export abstract class DerivedAttributeEvent extends PreviousCurrentEventAbstraction<
  DerivedAttributeNameLiteral,
  number
> {
  public get effective(): number {
    return Math.abs(this.current - this.previous);
  }
}

export class CurrentHPChangedEvent extends DerivedAttributeEvent {
  constructor(
    previous: number,
    current: number,
    public readonly details: {
      resisted: number;
      amplified: number;
      ignored: number;
      deflected: number;
    } = {
      resisted: 0,
      amplified: 0,
      ignored: 0,
      deflected: 0,
    }
  ) {
    super('CURRENT HP', previous, current);
  }
}

export class CurrentEPChangedEvent extends DerivedAttributeEvent {
  constructor(previous: number, current: number) {
    super('CURRENT EP', previous, current);
  }
}

export class CurrentAPChangedEvent extends DerivedAttributeEvent {
  constructor(previous: number, current: number) {
    super('CURRENT AP', previous, current);
  }
}
