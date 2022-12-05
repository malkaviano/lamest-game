import { DamageableInterface } from './damageable.interface';
import { HealableInterface } from './healable.interface';
import { WithCharacteristicsInterface } from './with-characteristics.interface';
import { WithDerivedAttibutesInterface } from './with-derived-attributes.interface';
import { WithSkillsInterface } from './with-skills.interface';

export interface ActorInterface
  extends WithCharacteristicsInterface,
    WithDerivedAttibutesInterface,
    WithSkillsInterface,
    DamageableInterface,
    HealableInterface {}
