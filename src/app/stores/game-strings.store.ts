import { LogMessageDefinition } from '../definitions/log-message.definition';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { EffectTypeLiteral } from '../literals/effect-type.literal';
import { LogCategoryLiteral } from '../literals/log-category.literal';
import { ResultLiteral } from '../literals/result.literal';

import gameMessages from '../../assets/game-strings.json';

export class GameStringsStore {
  private static logMessagesStore: KeyValueInterface<string> =
    gameMessages.logs;

  private static errorMessagesStore: KeyValueInterface<string> =
    gameMessages.errors;

  private static descriptionsStore: KeyValueInterface<string> =
    gameMessages.descriptions;

  public static get errorMessages(): KeyValueInterface<string> {
    return GameStringsStore.errorMessagesStore;
  }

  public static get descriptions(): KeyValueInterface<string> {
    return GameStringsStore.descriptionsStore;
  }

  public static createEffectRestoredHPMessage(
    effectType: EffectTypeLiteral,
    heal: string
  ): string {
    return GameStringsStore.logMessagesStore['effectRestoredHPMessage']
      .replace('${effectType}', effectType)
      .replace('${heal}', heal);
  }

  public static createEffectDamagedMessage(
    effectType: EffectTypeLiteral,
    damage: string
  ): string {
    return GameStringsStore.logMessagesStore['effectDamagedMessage']
      .replace('${damage}', damage)
      .replace('${effectType}', effectType);
  }

  public static createHPDidNotChangeMessage(): string {
    return GameStringsStore.logMessagesStore['hpDidNotChangeMessage'];
  }

  public static createDestroyedByDamageMessage(
    damageType: EffectTypeLiteral,
    damage: string
  ): string {
    return `${GameStringsStore.createEffectDamagedMessage(
      damageType,
      damage
    )} and ${GameStringsStore.logMessagesStore['destroyedMessage']}`;
  }

  public static createOpenedUsingMessage(item: string): string {
    return GameStringsStore.logMessagesStore['openedUsingMessage'].replace(
      '${item}',
      item
    );
  }

  public static createLockpickMovedMessage(direction: string): string {
    return GameStringsStore.logMessagesStore['lockpickMovedMessage'].replace(
      '${direction}',
      direction
    );
  }

  public static createLockpickStuckMessage(direction: string): string {
    return GameStringsStore.logMessagesStore['lockpickStuckMessage'].replace(
      '${direction}',
      direction
    );
  }

  public static createLockpickOpenedMessage(direction: string): string {
    return `${GameStringsStore.createLockpickMovedMessage(direction)} and ${
      GameStringsStore.logMessagesStore['lockpickOpenedMessage']
    }`;
  }

  public static createLockpickJammedMessage(direction: string): string {
    return `${GameStringsStore.createLockpickStuckMessage(direction)} and ${
      GameStringsStore.logMessagesStore['lockpickJammedMessage']
    }`;
  }

  public static createEnergizedMessage(energy: string): string {
    return GameStringsStore.logMessagesStore['energizedMessage'].replace(
      '${energy}',
      energy
    );
  }

  public static createEnergyDrainedMessage(energy: string): string {
    return GameStringsStore.logMessagesStore['energyDrainedMessage'].replace(
      '${energy}',
      energy
    );
  }

  public static createEnergyDidNotChangeMessage(): string {
    return GameStringsStore.logMessagesStore['energyDidNotChangeMessage'];
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
      GameStringsStore.logMessagesStore['skillCheckMessage']
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
      GameStringsStore.logMessagesStore['cannotCheckSkillMessage'].replace(
        '${skill}',
        skill
      )
    );
  }

  public static createEquippedLogMessage(
    actor: string,
    equipment: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'EQUIPPED',
      actor,
      GameStringsStore.logMessagesStore['equippedMessage'].replace(
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
      GameStringsStore.logMessagesStore['unEquippedMessage'].replace(
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
      GameStringsStore.logMessagesStore['consumedMessage'].replace(
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
      GameStringsStore.logMessagesStore['usedItemMessage']
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
      GameStringsStore.logMessagesStore['equipErrorMessage']
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
      GameStringsStore.logMessagesStore['tookMessage']
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
      GameStringsStore.logMessagesStore['sceneMessage']
        .replace('${from}', from)
        .replace('${selection}', selection)
    );
  }

  public static createLostItemLogMessage(
    actor: string,
    item: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'LOST',
      actor,
      GameStringsStore.logMessagesStore['lostMessage'].replace('${item}', item)
    );
  }

  public static createUnDodgeableAttackLogMessage(
    target: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'DENIED',
      target,
      GameStringsStore.logMessagesStore['unDodgeableAttackMessage']
    );
  }

  public static createNotFoundLogMessage(
    actor: string,
    label: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'NOT-FOUND',
      actor,
      GameStringsStore.logMessagesStore['notFoundMessage'].replace(
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
      GameStringsStore.logMessagesStore['itemInspectedMessage'].replace(
        '${item}',
        item
      )
    );
  }

  public static createOutOfDodgesLogMessage(
    target: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'DENIED',
      target,
      GameStringsStore.logMessagesStore['outOfDodgesMessage']
    );
  }

  public static createNotEnoughEnergyLogMessage(
    actor: string,
    item: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'ACTIVATION',
      actor,
      GameStringsStore.logMessagesStore['notEnoughEnergyMessage'].replace(
        '${item}',
        item
      )
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
      GameStringsStore.logMessagesStore['energySpentMessage']
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
      GameStringsStore.logMessagesStore['isDeadMessage']
    );
  }
}