import { ActionableEvent } from '../events/actionable.event';
import { ActorSituation } from '../literals/actor-situation.literal';
import { ActionReactive } from './action-reactive.interface';
import { WeaponEquipped } from './weapon-equipped.interface';
import { WithCharacteristicsInterface } from './with-characteristics.interface';
import { WithDerivedAttibutesInterface } from './with-derived-attributes.interface';
import { WithSkillsInterface } from './with-skills.interface';

export interface ActorInterface
  extends WithCharacteristicsInterface,
    WithDerivedAttibutesInterface,
    WithSkillsInterface,
    WeaponEquipped,
    ActionReactive {
  get action(): ActionableEvent | null;

  get situation(): ActorSituation;
}
