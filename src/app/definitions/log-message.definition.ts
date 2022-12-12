import { LogCategoryLiteral } from '../literals/log-category.literal';
import { ResultLiteral } from '../literals/result.literal';
import { SkillNameLiteral } from '../literals/skill-name.literal';

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

export const createHealedMessage = (heal: number) => `healed ${heal} hp`;

export const createDamagedMessage = (damage: number) =>
  `received ${damage} damage`;

export const createDestroyedByDamageMessage = (damage: number) =>
  `received ${damage} damage and was destroyed`;

export const createActorIsDeadMessage = (actor: string) =>
  new LogMessageDefinition('DIED', actor, 'is dead');

export const createCheckLogMessage = (
  actor: string,
  skill: SkillNameLiteral,
  roll: number,
  result: ResultLiteral
) =>
  new LogMessageDefinition(
    'CHECK',
    actor,
    `${skill} skill checked and rolled ${roll}, it was a ${result}`
  );

export const createCannotCheckLogMessage = (
  actor: string,
  skill: SkillNameLiteral
) =>
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
  skill: SkillNameLiteral,
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

export const createNotFoundLogMessage = (actor: string, item: string) =>
  new LogMessageDefinition('NOT-FOUND', actor, `${item} was not found`);

export const createOpenedUsingMessage = (item: string) =>
  `was opened using ${item}`;
