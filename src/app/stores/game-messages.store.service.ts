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
  private logMessagesStore: KeyValueInterface<string>;

  private errorMessagesStore: KeyValueInterface<string>;

  constructor() {
    this.logMessagesStore = gameMessages.logs;

    this.errorMessagesStore = gameMessages.errors;
  }

  public get errorMessages(): KeyValueInterface<string> {
    return this.errorMessagesStore;
  }

  public createEffectRestoredHPMessage(
    effectType: EffectTypeLiteral,
    heal: string
  ): string {
    return this.logMessagesStore['effectRestoredHPMessage']
      .replace('${effectType}', effectType)
      .replace('${heal}', heal);
  }

  public createEffectDamagedMessage(
    effectType: EffectTypeLiteral,
    damage: string
  ): string {
    return this.logMessagesStore['effectDamagedMessage']
      .replace('${damage}', damage)
      .replace('${effectType}', effectType);
  }

  public createHPDidNotChangeMessage(): string {
    return this.logMessagesStore['hpDidNotChangeMessage'];
  }

  public createDestroyedByDamageMessage(
    damageType: EffectTypeLiteral,
    damage: string
  ): string {
    return `${this.createEffectDamagedMessage(damageType, damage)} and ${
      this.logMessagesStore['destroyedMessage']
    }`;
  }

  public createOpenedUsingMessage(item: string): string {
    return this.logMessagesStore['openedUsingMessage'].replace('${item}', item);
  }

  public createLockpickMovedMessage(direction: string): string {
    return this.logMessagesStore['lockpickMovedMessage'].replace(
      '${direction}',
      direction
    );
  }

  public createLockpickStuckMessage(direction: string): string {
    return this.logMessagesStore['lockpickStuckMessage'].replace(
      '${direction}',
      direction
    );
  }

  public createLockpickOpenedMessage(direction: string): string {
    return `${this.createLockpickMovedMessage(direction)} and ${
      this.logMessagesStore['lockpickOpenedMessage']
    }`;
  }

  public createLockpickJammedMessage(direction: string): string {
    return `${this.createLockpickStuckMessage(direction)} and ${
      this.logMessagesStore['lockpickJammedMessage']
    }`;
  }

  public createEnergizedMessage(energy: string): string {
    return this.logMessagesStore['energizedMessage'].replace(
      '${energy}',
      energy
    );
  }

  public createEnergyDrainedMessage(energy: string): string {
    return this.logMessagesStore['energyDrainedMessage'].replace(
      '${energy}',
      energy
    );
  }

  public createEnergyDidNotChangeMessage(): string {
    return this.logMessagesStore['energyDidNotChangeMessage'];
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
      this.logMessagesStore['skillCheckMessage']
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
      this.logMessagesStore['cannotCheckSkillMessage'].replace(
        '${skill}',
        skill
      )
    );
  }

  public createEquippedLogMessage(
    actor: string,
    equipment: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'EQUIPPED',
      actor,
      this.logMessagesStore['equippedMessage'].replace(
        '${equipment}',
        equipment
      )
    );
  }

  public createUnEquippedLogMessage(
    actor: string,
    equipment: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'UNEQUIPPED',
      actor,
      this.logMessagesStore['unEquippedMessage'].replace(
        '${equipment}',
        equipment
      )
    );
  }

  public createConsumedLogMessage(
    actor: string,
    consumable: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'CONSUMED',
      actor,
      this.logMessagesStore['consumedMessage'].replace(
        '${consumable}',
        consumable
      )
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
      this.logMessagesStore['usedItemMessage']
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
      this.logMessagesStore['equipErrorMessage']
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
      this.logMessagesStore['tookMessage']
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
      this.logMessagesStore['sceneMessage']
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
      this.logMessagesStore['lostMessage'].replace('${item}', item)
    );
  }

  public createUnDodgeableAttackLogMessage(
    target: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'ATTACKED',
      target,
      this.logMessagesStore['unDodgeableAttackMessage']
    );
  }

  public createNotFoundLogMessage(
    actor: string,
    label: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'NOT-FOUND',
      actor,
      this.logMessagesStore['notFoundMessage'].replace('${label}', label)
    );
  }

  public createItemInspectedLogMessage(
    actor: string,
    item: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'INSPECTED',
      actor,
      this.logMessagesStore['itemInspectedMessage'].replace('${item}', item)
    );
  }

  public createOutOfDodgesLogMessage(target: string): LogMessageDefinition {
    return new LogMessageDefinition(
      'ATTACKED',
      target,
      this.logMessagesStore['outOfDodgesMessage']
    );
  }

  public createNotEnoughEnergyLogMessage(
    actor: string,
    item: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'ACTIVATION',
      actor,
      this.logMessagesStore['notEnoughEnergyMessage'].replace('${item}', item)
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
      this.logMessagesStore['energySpentMessage']
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
      this.logMessagesStore['isDeadMessage']
    );
  }
}
