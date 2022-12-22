import { LogMessageDefinition } from '../definitions/log-message.definition';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { EffectTypeLiteral } from '../literals/effect-type.literal';
import { LogCategoryLiteral } from '../literals/log-category.literal';
import { ResultLiteral } from '../literals/result.literal';

import gameMessages from '../../assets/game-messages.json';

export class GameMessagesStoreService {
  private static logMessagesStore: KeyValueInterface<string> =
    gameMessages.logs;

  private static errorMessagesStore: KeyValueInterface<string> =
    gameMessages.errors;

  public static get errorMessages(): KeyValueInterface<string> {
    return GameMessagesStoreService.errorMessagesStore;
  }

  public static createEffectRestoredHPMessage(
    effectType: EffectTypeLiteral,
    heal: string
  ): string {
    return GameMessagesStoreService.logMessagesStore['effectRestoredHPMessage']
      .replace('${effectType}', effectType)
      .replace('${heal}', heal);
  }

  public static createEffectDamagedMessage(
    effectType: EffectTypeLiteral,
    damage: string
  ): string {
    return GameMessagesStoreService.logMessagesStore['effectDamagedMessage']
      .replace('${damage}', damage)
      .replace('${effectType}', effectType);
  }

  public static createHPDidNotChangeMessage(): string {
    return GameMessagesStoreService.logMessagesStore['hpDidNotChangeMessage'];
  }

  public static createDestroyedByDamageMessage(
    damageType: EffectTypeLiteral,
    damage: string
  ): string {
    return `${GameMessagesStoreService.createEffectDamagedMessage(
      damageType,
      damage
    )} and ${GameMessagesStoreService.logMessagesStore['destroyedMessage']}`;
  }

  public static createOpenedUsingMessage(item: string): string {
    return GameMessagesStoreService.logMessagesStore[
      'openedUsingMessage'
    ].replace('${item}', item);
  }

  public static createLockpickMovedMessage(direction: string): string {
    return GameMessagesStoreService.logMessagesStore[
      'lockpickMovedMessage'
    ].replace('${direction}', direction);
  }

  public static createLockpickStuckMessage(direction: string): string {
    return GameMessagesStoreService.logMessagesStore[
      'lockpickStuckMessage'
    ].replace('${direction}', direction);
  }

  public static createLockpickOpenedMessage(direction: string): string {
    return `${GameMessagesStoreService.createLockpickMovedMessage(
      direction
    )} and ${
      GameMessagesStoreService.logMessagesStore['lockpickOpenedMessage']
    }`;
  }

  public static createLockpickJammedMessage(direction: string): string {
    return `${GameMessagesStoreService.createLockpickStuckMessage(
      direction
    )} and ${
      GameMessagesStoreService.logMessagesStore['lockpickJammedMessage']
    }`;
  }

  public static createEnergizedMessage(energy: string): string {
    return GameMessagesStoreService.logMessagesStore[
      'energizedMessage'
    ].replace('${energy}', energy);
  }

  public static createEnergyDrainedMessage(energy: string): string {
    return GameMessagesStoreService.logMessagesStore[
      'energyDrainedMessage'
    ].replace('${energy}', energy);
  }

  public static createEnergyDidNotChangeMessage(): string {
    return GameMessagesStoreService.logMessagesStore[
      'energyDidNotChangeMessage'
    ];
  }

  public static createSkillCheckLogMessage(
    actor: string,
    skill: string,
    roll: string,
    result: ResultLiteral
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'CHECK',
      actor,
      GameMessagesStoreService.logMessagesStore['skillCheckMessage']
        .replace('${skill}', skill)
        .replace('${roll}', roll)
        .replace('${result}', result)
    );
  }

  public static createCannotCheckSkillLogMessage(
    actor: string,
    skill: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'CHECK',
      actor,
      GameMessagesStoreService.logMessagesStore[
        'cannotCheckSkillMessage'
      ].replace('${skill}', skill)
    );
  }

  public static createEquippedLogMessage(
    actor: string,
    equipment: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'EQUIPPED',
      actor,
      GameMessagesStoreService.logMessagesStore['equippedMessage'].replace(
        '${equipment}',
        equipment
      )
    );
  }

  public static createUnEquippedLogMessage(
    actor: string,
    equipment: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'UNEQUIPPED',
      actor,
      GameMessagesStoreService.logMessagesStore['unEquippedMessage'].replace(
        '${equipment}',
        equipment
      )
    );
  }

  public static createConsumedLogMessage(
    actor: string,
    consumable: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'CONSUMED',
      actor,
      GameMessagesStoreService.logMessagesStore['consumedMessage'].replace(
        '${consumable}',
        consumable
      )
    );
  }

  public static createUsedItemLogMessage(
    actor: string,
    target: string,
    item: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'USED',
      actor,
      GameMessagesStoreService.logMessagesStore['usedItemMessage']
        .replace('${target}', target)
        .replace('${item}', item)
    );
  }

  public static createEquipErrorLogMessage(
    actor: string,
    skill: string,
    equipment: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'EQUIP-ERROR',
      actor,
      GameMessagesStoreService.logMessagesStore['equipErrorMessage']
        .replace('${skill}', skill)
        .replace('${equipment}', equipment)
    );
  }

  public static createTookLogMessage(
    actor: string,
    from: string,
    item: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'TOOK',
      actor,
      GameMessagesStoreService.logMessagesStore['tookMessage']
        .replace('${from}', from)
        .replace('${item}', item)
    );
  }

  public static createSceneLogMessage(
    actor: string,
    from: string,
    selection: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'SCENE',
      actor,
      GameMessagesStoreService.logMessagesStore['sceneMessage']
        .replace('${from}', from)
        .replace('${selection}', selection)
    );
  }

  public static createLostLogMessage(
    actor: string,
    item: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'LOST',
      actor,
      GameMessagesStoreService.logMessagesStore['lostMessage'].replace(
        '${item}',
        item
      )
    );
  }

  public static createUnDodgeableAttackLogMessage(
    target: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'ATTACKED',
      target,
      GameMessagesStoreService.logMessagesStore['unDodgeableAttackMessage']
    );
  }

  public static createNotFoundLogMessage(
    actor: string,
    label: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'NOT-FOUND',
      actor,
      GameMessagesStoreService.logMessagesStore['notFoundMessage'].replace(
        '${label}',
        label
      )
    );
  }

  public static createItemInspectedLogMessage(
    actor: string,
    item: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'INSPECTED',
      actor,
      GameMessagesStoreService.logMessagesStore['itemInspectedMessage'].replace(
        '${item}',
        item
      )
    );
  }

  public static createOutOfDodgesLogMessage(
    target: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'ATTACKED',
      target,
      GameMessagesStoreService.logMessagesStore['outOfDodgesMessage']
    );
  }

  public static createNotEnoughEnergyLogMessage(
    actor: string,
    item: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'ACTIVATION',
      actor,
      GameMessagesStoreService.logMessagesStore[
        'notEnoughEnergyMessage'
      ].replace('${item}', item)
    );
  }

  public static createEnergySpentLogMessage(
    actor: string,
    energySpent: string,
    item: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'ACTIVATION',
      actor,
      GameMessagesStoreService.logMessagesStore['energySpentMessage']
        .replace('${energySpent}', energySpent)
        .replace('${item}', item)
    );
  }

  public static createFreeLogMessage(
    category: LogCategoryLiteral,
    actor: string,
    message: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(category, actor, message);
  }

  public static createActorIsDeadLogMessage(
    actor: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'DIED',
      actor,
      GameMessagesStoreService.logMessagesStore['isDeadMessage']
    );
  }
}
