import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';

import { LogMessageDefinition } from '../definitions/log-message.definition';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { EffectTypeLiteral } from '../literals/effect-type.literal';
import { LogCategoryLiteral } from '../literals/log-category.literal';
import { ResultLiteral } from '../literals/result.literal';

export const stringMessagesUrl = '../../assets/strings.json';

export const STRING_MESSAGES_URL_TOKEN = new InjectionToken<string>(
  stringMessagesUrl
);

@Injectable({
  providedIn: 'root',
})
export class StringMessagesStoreService {
  public strings: KeyValueInterface<string>;

  constructor(
    @Inject(STRING_MESSAGES_URL_TOKEN)
    private readonly stringMessagesUrl: string,
    private readonly httpClient: HttpClient
  ) {
    this.strings = {};

    this.httpClient
      .get<KeyValueInterface<string>>(this.stringMessagesUrl)
      .subscribe((data) => {
        this.strings = data;
      });
  }

  public createEffectRestoredHPMessage = (
    effectType: EffectTypeLiteral,
    heal: number
  ) =>
    this.strings['effectRestoredHPMessage']
      .replace('${effectType}', effectType)
      .replace('${heal}', heal.toString());

  public createEffectDamagedMessage = (
    effectType: EffectTypeLiteral,
    damage: number
  ) =>
    this.strings['effectDamagedMessage']
      .replace('${damage}', damage.toString())
      .replace('${effectType}', effectType);

  public createHPDidNotChangeMessage = () =>
    this.strings['hpDidNotChangeMessage'];

  public createDestroyedByDamageMessage = (
    damageType: EffectTypeLiteral,
    damage: number
  ) =>
    `${this.createEffectDamagedMessage(damageType, damage)} and ${
      this.strings['destroyedMessage']
    }`;

  public createActorIsDeadLogMessage = (actor: string) =>
    new LogMessageDefinition('DIED', actor, this.strings['isDeadMessage']);

  public createOpenedUsingMessage = (item: string) =>
    this.strings['openedUsingMessage'].replace('${item}', item);

  public createLockpickMovedMessage = (direction: string) =>
    this.strings['lockpickMovedMessage'].replace('${direction}', direction);

  public createLockpickStuckMessage = (direction: string) =>
    this.strings['lockpickStuckMessage'].replace('${direction}', direction);

  public createLockpickOpenedMessage = (direction: string) =>
    `${this.createLockpickMovedMessage(direction)} and ${
      this.strings['lockpickOpenedMessage']
    }`;

  public createLockpickJammedMessage = (direction: string) =>
    `${this.createLockpickStuckMessage(direction)} and ${
      this.strings['lockpickJammedMessage']
    }`;

  public createSkillCheckLogMessage = (
    actor: string,
    skill: string,
    roll: number,
    result: ResultLiteral
  ) =>
    new LogMessageDefinition(
      'CHECK',
      actor,
      this.strings['skillCheckMessage']
        .replace('${skill}', skill)
        .replace('${roll}', roll.toString())
        .replace('${result}', result)
    );

  public createCannotCheckSkillLogMessage = (actor: string, skill: string) =>
    new LogMessageDefinition(
      'CHECK',
      actor,
      this.strings['cannotCheckSkillMessage'].replace('${skill}', skill)
    );

  public createEquippedLogMessage = (actor: string, equipment: string) =>
    new LogMessageDefinition(
      'EQUIPPED',
      actor,
      this.strings['equippedMessage'].replace('${equipment}', equipment)
    );

  public createUnEquippedLogMessage = (actor: string, equipment: string) =>
    new LogMessageDefinition(
      'UNEQUIPPED',
      actor,
      this.strings['unEquippedMessage'].replace('${equipment}', equipment)
    );

  public createConsumedLogMessage = (actor: string, consumable: string) =>
    new LogMessageDefinition(
      'CONSUMED',
      actor,
      this.strings['consumedMessage'].replace('${consumable}', consumable)
    );

  public createUsedItemLogMessage = (
    actor: string,
    target: string,
    item: string
  ) =>
    new LogMessageDefinition(
      'USED',
      actor,
      this.strings['usedItemMessage']
        .replace('${target}', target)
        .replace('${item}', item)
    );

  public createEquipErrorLogMessage = (
    actor: string,
    skill: string,
    equipment: string
  ) =>
    new LogMessageDefinition(
      'EQUIP-ERROR',
      actor,
      this.strings['equipErrorMessage']
        .replace('${skill}', skill)
        .replace('${equipment}', equipment)
    );

  public createTookLogMessage = (actor: string, from: string, item: string) =>
    new LogMessageDefinition(
      'TOOK',
      actor,
      this.strings['tookMessage']
        .replace('${from}', from)
        .replace('${item}', item)
    );

  public createSceneLogMessage = (
    actor: string,
    from: string,
    selection: string
  ) =>
    new LogMessageDefinition(
      'SCENE',
      actor,
      this.strings['sceneMessage']
        .replace('${from}', from)
        .replace('${selection}', selection)
    );

  public createLostLogMessage = (actor: string, item: string) =>
    new LogMessageDefinition(
      'LOST',
      actor,
      this.strings['lostMessage'].replace('${item}', item)
    );

  public createUnDodgeableAttackLogMessage = (target: string) =>
    new LogMessageDefinition(
      'ATTACKED',
      target,
      this.strings['unDodgeableAttackMessage']
    );

  public createNotFoundLogMessage = (actor: string, label: string) =>
    new LogMessageDefinition(
      'NOT-FOUND',
      actor,
      this.strings['notFoundMessage'].replace('${label}', label)
    );

  public createItemInspectedLogMessage = (actor: string, item: string) =>
    new LogMessageDefinition(
      'INSPECTED',
      actor,
      this.strings['itemInspectedMessage'].replace('${item}', item)
    );

  public createOutOfDodgesLogMessage = (target: string) =>
    new LogMessageDefinition(
      'ATTACKED',
      target,
      this.strings['outOfDodgesMessage']
    );

  public createEnergizedMessage = (energy: number) =>
    this.strings['energizedMessage'].replace('${energy}', energy.toString());

  public createEnergyDrainedMessage = (energy: number) =>
    this.strings['energyDrainedMessage'].replace(
      '${energy}',
      energy.toString()
    );

  public createEnergyDidNotChangeMessage = () =>
    this.strings['energyDidNotChangeMessage'];

  public createNotEnoughEnergyLogMessage = (actor: string, item: string) =>
    new LogMessageDefinition(
      'ACTIVATION',
      actor,
      this.strings['notEnoughEnergyMessage'].replace('${item}', item)
    );

  public createEnergySpentLogMessage = (
    actor: string,
    energySpent: number,
    item: string
  ) =>
    new LogMessageDefinition(
      'ACTIVATION',
      actor,
      this.strings['energySpentMessage']
        .replace('${energySpent}', energySpent.toString())
        .replace('${item}', item)
    );

  public createFreeLogMessage = (
    category: LogCategoryLiteral,
    actor: string,
    message: string
  ) => new LogMessageDefinition(category, actor, message);
}
