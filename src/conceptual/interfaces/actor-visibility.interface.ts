import { VisibilityLiteral } from '../literals/visibility.literal';

export interface ActorVisibilityInterface {
  get visibility(): VisibilityLiteral;

  changeVisibility(visibility: VisibilityLiteral): void;
}
