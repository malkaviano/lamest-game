import { InteractiveInterface } from './interactive.interface';

export interface RuleExtrasInterface {
  readonly target?: InteractiveInterface;
  readonly targetDodgesPerformed?: number;
}
