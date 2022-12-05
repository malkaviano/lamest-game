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

export const createDamagedMessage = (damage: number) =>
  `received ${damage} damage`;

export const createDestroyedByDamageMessage = (damage: number) =>
  `received ${damage} damage and was destroyed`;

export const createDestroyedByActionMessage = (name: string, label: string) =>
  `destroyed by ${label} using ${name}`;

export const createKilledByDamageMessage = (damage: number) =>
  `received ${damage} damage and was killed`;

export const createActorDiedMessage = (actor: string) =>
  new LogMessageDefinition('DIED', actor, 'died');

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
    `${skill} skill cannot be checked because it's value is zero`
  );

export const createEquippedLogMessage = (actor: string, equipment: string) =>
  new LogMessageDefinition('EQUIPPED', actor, `equipped ${equipment}`);

export const createUnEquippedLogMessage = (actor: string, equipment: string) =>
  new LogMessageDefinition('UNEQUIPPED', actor, `un-equipped ${equipment}`);

export const createConsumedLogMessage = (actor: string, consumable: string) =>
  new LogMessageDefinition('CONSUMED', actor, `consumed ${consumable}`);

export const createHealedLogMessage = (actor: string, heal: number) =>
  new LogMessageDefinition('HEALED', actor, `healed ${heal} hp`);

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

export const createMissedAttackLogMessage = (actor: string, target: string) =>
  new LogMessageDefinition('MISSED', actor, `attacked ${target} but missed`);

export const createDodgedLogMessage = (actor: string, attacker: string) =>
  new LogMessageDefinition('MISSED', actor, `dodged ${attacker}'s attack`);
