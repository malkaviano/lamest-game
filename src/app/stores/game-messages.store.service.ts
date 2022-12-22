import { Injectable } from '@angular/core';

import { LogMessageDefinition } from '../definitions/log-message.definition';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { EffectTypeLiteral } from '../literals/effect-type.literal';
import { LogCategoryLiteral } from '../literals/log-category.literal';
import { ResultLiteral } from '../literals/result.literal';

import stringMessages from '../../assets/strings.json';

@Injectable({
  providedIn: 'root',
})
export class GameMessagesStoreService {
  private mStrings: KeyValueInterface<string>;

  constructor() {
    this.mStrings = stringMessages;
  }

  public get strings(): KeyValueInterface<string> {
    return this.mStrings;
  }

  public createEffectRestoredHPMessage(
    effectType: EffectTypeLiteral,
    heal: string
  ): string {
    return this.strings['effectRestoredHPMessage']
      .replace('${effectType}', effectType)
      .replace('${heal}', heal);
  }

  public createEffectDamagedMessage(
    effectType: EffectTypeLiteral,
    damage: string
  ): string {
    return this.strings['effectDamagedMessage']
      .replace('${damage}', damage)
      .replace('${effectType}', effectType);
  }

  public createHPDidNotChangeMessage(): string {
    return this.strings['hpDidNotChangeMessage'];
  }

  public createDestroyedByDamageMessage(
    damageType: EffectTypeLiteral,
    damage: string
  ): string {
    return `${this.createEffectDamagedMessage(damageType, damage)} and ${
      this.strings['destroyedMessage']
    }`;
  }

  public createOpenedUsingMessage(item: string): string {
    return this.strings['openedUsingMessage'].replace('${item}', item);
  }

  public createLockpickMovedMessage(direction: string): string {
    return this.strings['lockpickMovedMessage'].replace(
      '${direction}',
      direction
    );
  }

  public createLockpickStuckMessage(direction: string): string {
    return this.strings['lockpickStuckMessage'].replace(
      '${direction}',
      direction
    );
  }

  public createLockpickOpenedMessage(direction: string): string {
    return `${this.createLockpickMovedMessage(direction)} and ${
      this.strings['lockpickOpenedMessage']
    }`;
  }

  public createLockpickJammedMessage(direction: string): string {
    return `${this.createLockpickStuckMessage(direction)} and ${
      this.strings['lockpickJammedMessage']
    }`;
  }

  public createEnergizedMessage(energy: string): string {
    return this.strings['energizedMessage'].replace('${energy}', energy);
  }

  public createEnergyDrainedMessage(energy: string): string {
    return this.strings['energyDrainedMessage'].replace('${energy}', energy);
  }

  public createEnergyDidNotChangeMessage(): string {
    return this.strings['energyDidNotChangeMessage'];
  }

  public createSkillCheckLogMessage(
    actor: string,
    skill: string,
    roll: string,
    result: ResultLiteral
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'CHECK',
      actor,
      this.strings['skillCheckMessage']
        .replace('${skill}', skill)
        .replace('${roll}', roll)
        .replace('${result}', result)
    );
  }

  public createCannotCheckSkillLogMessage(
    actor: string,
    skill: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'CHECK',
      actor,
      this.strings['cannotCheckSkillMessage'].replace('${skill}', skill)
    );
  }

  public createEquippedLogMessage(
    actor: string,
    equipment: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'EQUIPPED',
      actor,
      this.strings['equippedMessage'].replace('${equipment}', equipment)
    );
  }

  public createUnEquippedLogMessage(
    actor: string,
    equipment: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'UNEQUIPPED',
      actor,
      this.strings['unEquippedMessage'].replace('${equipment}', equipment)
    );
  }

  public createConsumedLogMessage(
    actor: string,
    consumable: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'CONSUMED',
      actor,
      this.strings['consumedMessage'].replace('${consumable}', consumable)
    );
  }

  public createUsedItemLogMessage(
    actor: string,
    target: string,
    item: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'USED',
      actor,
      this.strings['usedItemMessage']
        .replace('${target}', target)
        .replace('${item}', item)
    );
  }

  public createEquipErrorLogMessage(
    actor: string,
    skill: string,
    equipment: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'EQUIP-ERROR',
      actor,
      this.strings['equipErrorMessage']
        .replace('${skill}', skill)
        .replace('${equipment}', equipment)
    );
  }

  public createTookLogMessage(
    actor: string,
    from: string,
    item: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'TOOK',
      actor,
      this.strings['tookMessage']
        .replace('${from}', from)
        .replace('${item}', item)
    );
  }

  public createSceneLogMessage(
    actor: string,
    from: string,
    selection: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'SCENE',
      actor,
      this.strings['sceneMessage']
        .replace('${from}', from)
        .replace('${selection}', selection)
    );
  }

  public createLostLogMessage(
    actor: string,
    item: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'LOST',
      actor,
      this.strings['lostMessage'].replace('${item}', item)
    );
  }

  public createUnDodgeableAttackLogMessage(
    target: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'ATTACKED',
      target,
      this.strings['unDodgeableAttackMessage']
    );
  }

  public createNotFoundLogMessage(
    actor: string,
    label: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'NOT-FOUND',
      actor,
      this.strings['notFoundMessage'].replace('${label}', label)
    );
  }

  public createItemInspectedLogMessage(
    actor: string,
    item: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'INSPECTED',
      actor,
      this.strings['itemInspectedMessage'].replace('${item}', item)
    );
  }

  public createOutOfDodgesLogMessage(target: string): LogMessageDefinition {
    return new LogMessageDefinition(
      'ATTACKED',
      target,
      this.strings['outOfDodgesMessage']
    );
  }

  public createNotEnoughEnergyLogMessage(
    actor: string,
    item: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'ACTIVATION',
      actor,
      this.strings['notEnoughEnergyMessage'].replace('${item}', item)
    );
  }

  public createEnergySpentLogMessage(
    actor: string,
    energySpent: string,
    item: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'ACTIVATION',
      actor,
      this.strings['energySpentMessage']
        .replace('${energySpent}', energySpent)
        .replace('${item}', item)
    );
  }

  public createFreeLogMessage(
    category: LogCategoryLiteral,
    actor: string,
    message: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(category, actor, message);
  }

  public createActorIsDeadLogMessage(actor: string): LogMessageDefinition {
    return new LogMessageDefinition(
      'DIED',
      actor,
      this.strings['isDeadMessage']
    );
  }
}
