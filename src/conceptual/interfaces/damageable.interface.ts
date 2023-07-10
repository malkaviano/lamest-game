import { HitPointsEvent } from '@conceptual/events/hit-points.event';

export interface DamageableInterface {
  damaged(damage: number): HitPointsEvent;
}
