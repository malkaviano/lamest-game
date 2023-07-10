import { Observable } from 'rxjs';

import { WeaponDefinition } from '@definitions/weapon.definition';
import { EnergyPointsEvent } from '@conceptual/events/energy-points.event';
import { HitPointsEvent } from '@conceptual/events/hit-points.event';
import { VisibilityLiteral } from '@literals/visibility.literal';
import { ActionPointsEvent } from '@conceptual/events/action-points.event';

export interface ActorEventsInterface {
  readonly hpChanged$: Observable<HitPointsEvent>;
  readonly weaponEquippedChanged$: Observable<WeaponDefinition>;
  readonly epChanged$: Observable<EnergyPointsEvent>;
  readonly visibilityChanged$: Observable<VisibilityLiteral>;
  readonly apChanged$: Observable<ActionPointsEvent>;
}
