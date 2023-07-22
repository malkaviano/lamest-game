import { Observable } from 'rxjs';

import { VisibilityLiteral } from '@literals/visibility.literal';

export interface VisibilityInterface {
  get visibility(): VisibilityLiteral;

  changeVisibility(visibility: VisibilityLiteral): void;

  visibilityChanged$: Observable<VisibilityLiteral>;
}
