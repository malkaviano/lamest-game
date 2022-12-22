import { Injectable } from '@angular/core';

import { LogMessageDefinition } from '../definitions/log-message.definition';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { EffectTypeLiteral } from '../literals/effect-type.literal';
import { LogCategoryLiteral } from '../literals/log-category.literal';
import { ResultLiteral } from '../literals/result.literal';

import gameMessages from '../../assets/game-messages.json';

@Injectable({
  providedIn: 'root',
})
export class GameMessagesStoreService {
  private storedMessages: KeyValueInterface<string>;

  constructor() {
    this.storedMessages = gameMessages;
  }

  public get gameMessages(): KeyValueInterface<string> {
    return this.storedMessages;
  }

  public createEffectRestoredHPMessage(
    effectType: EffectTypeLiteral,
    heal: string
  ): string {
    return this.gameMessages['effectRestoredHPMessage']
      .replace('${effectType}', effectType)
      .replace('${heal}', heal);
  }

  public createEffectDamagedMessage(
    effectType: EffectTypeLiteral,
    damage: string
  ): string {
    return this.gameMessages['effectDamagedMessage']
      .replace('${damage}', damage)
      .replace('${effectType}', effectType);
  }

  public createHPDidNotChangeMessage(): string {
    return this.gameMessages['hpDidNotChangeMessage'];
  }

  public createDestroyedByDamageMessage(
    damageType: EffectTypeLiteral,
    damage: string
  ): string {
    return `${this.createEffectDamagedMessage(damageType, damage)} and ${
      this.gameMessages['destroyedMessage']
    }`;
  }

  public createOpenedUsingMessage(item: string): string {
    return this.gameMessages['openedUsingMessage'].replace('${item}', item);
  }

  public createLockpickMovedMessage(direction: string): string {
    return this.gameMessages['lockpickMovedMessage'].replace(
      '${direction}',
      direction
    );
  }

  public createLockpickStuckMessage(direction: string): string {
    return this.gameMessages['lockpickStuckMessage'].replace(
      '${direction}',
      direction
    );
  }

  public createLockpickOpenedMessage(direction: string): string {
    return `${this.createLockpickMovedMessage(direction)} and ${
      this.gameMessages['lockpickOpenedMessage']
    }`;
  }

  public createLockpickJammedMessage(direction: string): string {
    return `${this.createLockpickStuckMessage(direction)} and ${
      this.gameMessages['lockpickJammedMessage']
    }`;
  }

  public createEnergizedMessage(energy: string): string {
    return this.gameMessages['energizedMessage'].replace('${energy}', energy);
  }

  public createEnergyDrainedMessage(energy: string): string {
    return this.gameMessages['energyDrainedMessage'].replace(
      '${energy}',
      energy
    );
  }

  public createEnergyDidNotChangeMessage(): string {
    return this.gameMessages['energyDidNotChangeMessage'];
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
      this.gameMessages['skillCheckMessage']
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
      this.gameMessages['cannotCheckSkillMessage'].replace('${skill}', skill)
    );
  }

  public createEquippedLogMessage(
    actor: string,
    equipment: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'EQUIPPED',
      actor,
      this.gameMessages['equippedMessage'].replace('${equipment}', equipment)
    );
  }

  public createUnEquippedLogMessage(
    actor: string,
    equipment: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'UNEQUIPPED',
      actor,
      this.gameMessages['unEquippedMessage'].replace('${equipment}', equipment)
    );
  }

  public createConsumedLogMessage(
    actor: string,
    consumable: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'CONSUMED',
      actor,
      this.gameMessages['consumedMessage'].replace('${consumable}', consumable)
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
      this.gameMessages['usedItemMessage']
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
      this.gameMessages['equipErrorMessage']
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
      this.gameMessages['tookMessage']
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
      this.gameMessages['sceneMessage']
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
      this.gameMessages['lostMessage'].replace('${item}', item)
    );
  }

  public createUnDodgeableAttackLogMessage(
    target: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'ATTACKED',
      target,
      this.gameMessages['unDodgeableAttackMessage']
    );
  }

  public createNotFoundLogMessage(
    actor: string,
    label: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'NOT-FOUND',
      actor,
      this.gameMessages['notFoundMessage'].replace('${label}', label)
    );
  }

  public createItemInspectedLogMessage(
    actor: string,
    item: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'INSPECTED',
      actor,
      this.gameMessages['itemInspectedMessage'].replace('${item}', item)
    );
  }

  public createOutOfDodgesLogMessage(target: string): LogMessageDefinition {
    return new LogMessageDefinition(
      'ATTACKED',
      target,
      this.gameMessages['outOfDodgesMessage']
    );
  }

  public createNotEnoughEnergyLogMessage(
    actor: string,
    item: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'ACTIVATION',
      actor,
      this.gameMessages['notEnoughEnergyMessage'].replace('${item}', item)
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
      this.gameMessages['energySpentMessage']
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
      this.gameMessages['isDeadMessage']
    );
  }
}
