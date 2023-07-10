import { ActionableEvent } from '@conceptual/events/actionable.event';
import { ActorInterface } from './actor.interface';
import { InteractiveInterface } from './interactive.interface';
import { RuleResultLiteral } from '@literals/rule-result.literal';
import { GameItemDefinition } from '@definitions/game-item.definition';
import { WeaponDefinition } from '@definitions/weapon.definition';
import { UsableDefinition } from '@definitions/usable.definition';
import { ReadableDefinition } from '@definitions/readable.definition';
import { ConsumableDefinition } from '@definitions/consumable.definition';
import { EffectTypeLiteral } from '@literals/effect-type.literal';
import { RuleNameLiteral } from '@literals/rule-name.literal';

export interface RuleResultInterface {
  readonly name: RuleNameLiteral;
  readonly event: ActionableEvent;
  readonly result: RuleResultLiteral;
  readonly actor: ActorInterface;
  readonly target?: InteractiveInterface;
  readonly picked?: GameItemDefinition;
  readonly used?: UsableDefinition;
  readonly read?: ReadableDefinition;
  readonly equipped?: WeaponDefinition;
  readonly unequipped?: WeaponDefinition;
  readonly affected?: WeaponDefinition;
  readonly skill?: {
    readonly name: string;
    readonly roll?: number;
  };
  readonly consumable?: {
    readonly consumed: ConsumableDefinition;
    readonly hp: number;
    readonly energy: number;
  };
  readonly dodged?: boolean;
  readonly effect?: { type: EffectTypeLiteral; amount: number };
}
