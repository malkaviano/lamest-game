import { ActionReactiveInterface } from './action-reactive.interface';

export interface RuleExtrasInterface {
  readonly target?: ActionReactiveInterface;
  readonly targetDodgesPerformed?: number;
}
