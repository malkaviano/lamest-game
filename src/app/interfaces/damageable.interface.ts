import { HitPointsEvent } from '../events/hit-points.event';

export interface DamageableInterface {
  damaged(damage: number): HitPointsEvent;
}
