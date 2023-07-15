import { Observable } from 'rxjs';

import { WeaponDefinition } from '@definitions/weapon.definition';
import { VisibilityLiteral } from '@literals/visibility.literal';
import { DerivedAttributeEvent } from '@events/derived-attribute.event';

export interface ActorEventsInterface {
  readonly derivedAttributeChanged$: Observable<DerivedAttributeEvent>;
  readonly weaponEquippedChanged$: Observable<WeaponDefinition>;
  readonly visibilityChanged$: Observable<VisibilityLiteral>;
}
