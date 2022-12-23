import { Observable } from 'rxjs';

import { WeaponDefinition } from '../definitions/weapon.definition';
import { EnergyPointsEvent } from '../events/energy-points.event';
import { HitPointsEvent } from '../events/hit-points.event';
import { VisibilityLiteral } from '../literals/visibility.literal';

export interface ActorEventsInterface {
  readonly hpChanged$: Observable<HitPointsEvent>;
  readonly weaponEquippedChanged$: Observable<WeaponDefinition>;
  readonly epChanged$: Observable<EnergyPointsEvent>;
  readonly visibilityChanged$: Observable<VisibilityLiteral>;
}
