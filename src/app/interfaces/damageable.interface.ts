import { HitPointsEvent } from '../events/hitpoints.event';

export interface DamageableInterface {
  damaged(damage: number): HitPointsEvent;
}
