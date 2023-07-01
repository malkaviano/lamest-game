import { VisibilityLiteral } from '../literals/visibility.literal';

export interface PolicyResultInterface {
  readonly visibility?: {
    readonly actor?: VisibilityLiteral;
    readonly target?: VisibilityLiteral;
  };
}
