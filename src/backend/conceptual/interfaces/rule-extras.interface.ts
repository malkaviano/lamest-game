import { InteractiveInterface } from '@interfaces/interactive.interface';

export interface RuleExtrasInterface {
  readonly target?: InteractiveInterface;
  readonly targetDodgesPerformed?: number;
}
