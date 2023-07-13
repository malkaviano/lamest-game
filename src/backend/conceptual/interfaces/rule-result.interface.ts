import { ActionableEvent } from '@events/actionable.event';
import { ActorInterface } from '@interfaces/actor.interface';
import { InteractiveInterface } from '@interfaces/interactive.interface';
import { RuleResultLiteral } from '@literals/rule-result.literal';
import { GameItemDefinition } from '@definitions/game-item.definition';
import { WeaponDefinition } from '@definitions/weapon.definition';
import { UsableDefinition } from '@definitions/usable.definition';
import { ReadableDefinition } from '@definitions/readable.definition';
import { ConsumableDefinition } from '@definitions/consumable.definition';
import { EffectTypeLiteral } from '@literals/effect-type.literal';
import { RuleNameLiteral } from '@literals/rule-name.literal';
import { CheckResultLiteral } from '@literals/check-result.literal';

export interface RuleResultInterface {
  name: RuleNameLiteral;
  event: ActionableEvent;
  result: RuleResultLiteral;
  actor: ActorInterface;
  target?: InteractiveInterface;
  picked?: GameItemDefinition;
  used?: UsableDefinition;
  read?: ReadableDefinition;
  equipped?: WeaponDefinition;
  unequipped?: WeaponDefinition;
  affected?: WeaponDefinition;
  skillName?: string;
  roll?: {
    checkRoll?: number;
    result: CheckResultLiteral;
  };
  consumable?: {
    consumed: ConsumableDefinition;
    hp?: number;
    energy?: number;
  };
  dodged?: boolean;
  effect?: { type: EffectTypeLiteral; amount: number };
  dropped?: GameItemDefinition;
}
