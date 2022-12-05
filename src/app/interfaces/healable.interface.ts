import { HitPointsEvent } from '../events/hitpoints.event';

export interface HealableInterface {
  healed(healed: number): HitPointsEvent;
}
