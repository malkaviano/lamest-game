import { HitPointsEvent } from '../events/hitpoints.event';

export interface HealableInterface {
  healed(heal: number): HitPointsEvent;
}
