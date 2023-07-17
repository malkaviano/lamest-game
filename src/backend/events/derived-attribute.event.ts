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

  public detailsToStr(): string {
    const cpy: { [k: string]: number } = {};

    if (this.details['resisted'] !== 0) {
      cpy['resisted'] = this.details['resisted'];
    }

    if (this.details['amplified'] !== 0) {
      cpy['amplified'] = this.details['amplified'];
    }

    if (this.details['deflected'] !== 0) {
      cpy['deflected'] = this.details['deflected'];
    }

    if (this.details['ignored'] !== 0) {
      cpy['ignored'] = this.details['ignored'];
    }

    const str = JSON.stringify(cpy);

    return str === '{}' ? '' : ` ${str}`;
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
