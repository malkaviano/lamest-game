import { Observable } from 'rxjs';

import { VisibilityLiteral } from '@literals/visibility.literal';
import { DerivedAttributeEvent } from '@events/derived-attribute.event';
import {
  ArmorChangedEvent,
  WeaponChangedEvent,
} from '@events/equipment-changed.event';

export interface ActorEventsInterface {
  readonly derivedAttributeChanged$: Observable<DerivedAttributeEvent>;
  readonly equipmentChanged$: Observable<
    WeaponChangedEvent | ArmorChangedEvent
  >;
  readonly visibilityChanged$: Observable<VisibilityLiteral>;
}
