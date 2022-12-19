import { VisibilityLiteral } from '../literals/visibility.literal';

export interface ActorVisibilityInterface {
  get visibility(): VisibilityLiteral;
  set visibility(visibility: VisibilityLiteral);
}
