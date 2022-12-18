import { EffectTypeLiteral } from '../literals/effect-type.literal';
import { LogCategoryLiteral } from '../literals/log-category.literal';
import { ResultLiteral } from '../literals/result.literal';

export class LogMessageDefinition {
  constructor(
    public readonly category: LogCategoryLiteral,
    public readonly actor: string,
    public readonly message: string
  ) {}

  public toString(): string {
    return `${this.actor}: ${this.message}`;
  }
}

export const createEffectRestoredHPMessage = (
  effectType: EffectTypeLiteral,
  heal: number
) => `received ${effectType} effect, healed ${heal} hp`;

export const createEnergizedMessage = (energy: number) =>
  `restored ${energy} energy`;

export const createEffectDamagedMessage = (
  damage: number,
  effectType: EffectTypeLiteral
) => `received ${damage} ${effectType} damage`;

export const createHPDidNotChangeMessage = () => `HP did not change`;

export const createDestroyedByDamageMessage = (
  damage: number,
  damageType: EffectTypeLiteral
) => `${createEffectDamagedMessage(damage, damageType)} and was destroyed`;

export const createActorIsDeadMessage = (actor: string) =>
  new LogMessageDefinition('DIED', actor, 'is dead');

export const createCheckLogMessage = (
  actor: string,
  skill: string,
  roll: number,
  result: ResultLiteral
) =>
  new LogMessageDefinition(
    'CHECK',
    actor,
    `${skill} skill checked and rolled ${roll}, it was a ${result}`
  );

export const createCannotCheckLogMessage = (actor: string, skill: string) =>
  new LogMessageDefinition(
    'CHECK',
    actor,
    `${skill} skill couldn't be checked because it's value is zero`
  );

export const createEquippedLogMessage = (actor: string, equipment: string) =>
  new LogMessageDefinition('EQUIPPED', actor, `equipped ${equipment}`);

export const createUnEquippedLogMessage = (actor: string, equipment: string) =>
  new LogMessageDefinition('UNEQUIPPED', actor, `un-equipped ${equipment}`);

export const createConsumedLogMessage = (actor: string, consumable: string) =>
  new LogMessageDefinition('CONSUMED', actor, `consumed ${consumable}`);

export const createAttackedLogMessage = (
  actor: string,
  target: string,
  weapon: string
) =>
  new LogMessageDefinition(
    'ATTACKED',
    actor,
    `attacked ${target} using ${weapon}`
  );

export const createFreeLogMessage = (actor: string, message: string) =>
  new LogMessageDefinition('FREE', actor, `${message}`);

export const createEquipErrorLogMessage = (
  actor: string,
  skill: string,
  equipment: string
) =>
  new LogMessageDefinition(
    'EQUIP-ERROR',
    actor,
    `${skill} is required to equip ${equipment}`
  );

export const createTookLogMessage = (
  actor: string,
  from: string,
  item: string
) => new LogMessageDefinition('TOOK', actor, `took ${item} from ${from}`);

export const createSceneLogMessage = (
  actor: string,
  from: string,
  selection: string
) =>
  new LogMessageDefinition(
    'SCENE',
    actor,
    `selected ${selection} from ${from}`
  );

export const createLostLogMessage = (actor: string, item: string) =>
  new LogMessageDefinition('LOST', actor, `lost ${item}`);

export const createUnDodgeableAttackLogMessage = (target: string) =>
  new LogMessageDefinition('ATTACKED', target, `Attack is not dodgeable`);

export const createNotFoundLogMessage = (actor: string, label: string) =>
  new LogMessageDefinition(
    'NOT-FOUND',
    actor,
    `${label} failed, required item was not found in inventory`
  );

export const createOpenedUsingMessage = (item: string) =>
  `was opened using ${item}`;

export const createLockpickMovedMessage = (direction: string) =>
  `lockpick moved ${direction}`;

export const createLockpickStuckMessage = (direction: string) =>
  `lockpick got stuck moving ${direction}`;

export const createLockpickOpenedMessage = (direction: string) =>
  `${createLockpickMovedMessage(direction)} and opened the container`;

export const createLockpickJammedMessage = (direction: string) =>
  `${createLockpickStuckMessage(direction)} and cannot be lockpicked anymore`;

export const createItemInspectedLogs = (actor: string, item: string) =>
  new LogMessageDefinition('INSPECTED', actor, `inspected ${item}`);

export const createOutOfDodgesLogMessage = (target: string) =>
  new LogMessageDefinition('ATTACKED', target, `was out of dodges`);
