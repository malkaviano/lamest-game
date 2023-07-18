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
import { ArmorDefinition } from '@definitions/armor.definition';

export type RuleResultPayload = {
  readonly target?: InteractiveInterface;
  readonly picked?: GameItemDefinition;
  readonly used?: UsableDefinition;
  readonly read?: ReadableDefinition;
  readonly equipped?: WeaponDefinition;
  readonly unequipped?: WeaponDefinition;
  readonly affected?: WeaponDefinition;
  readonly skillName?: string;
  readonly roll?: {
    readonly checkRoll?: number;
    readonly result: CheckResultLiteral;
  };
  readonly consumable?: {
    readonly consumed: ConsumableDefinition;
    readonly hp?: number;
    readonly energy?: number;
  };
  readonly dodged?: boolean;
  readonly effect?: { type: EffectTypeLiteral; amount: number };
  readonly dropped?: GameItemDefinition;
  readonly wearing?: ArmorDefinition;
  readonly strip?: ArmorDefinition;
};

export type RuleResult = {
  readonly name: RuleNameLiteral;
  readonly event: ActionableEvent;
  readonly result: RuleResultLiteral;
  readonly actor: ActorInterface;
} & RuleResultPayload;
