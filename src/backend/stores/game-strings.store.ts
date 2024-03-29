import { LogMessageDefinition } from '@definitions/log-message.definition';
import { ReadonlyKeyValueWrapper } from '@wrappers/key-value.wrapper';
import { EffectTypeLiteral } from '@literals/effect-type.literal';
import { LogCategoryLiteral } from '@literals/log-category.literal';
import { CheckResultLiteral } from '@literals/check-result.literal';

import gameMessages from '@assets/game-strings.json';

export class GameStringsStore {
  private static logMessagesStore: ReadonlyKeyValueWrapper<string> =
    gameMessages.logs;

  private static errorMessagesStore: ReadonlyKeyValueWrapper<string> =
    gameMessages.errors;

  private static descriptionsStore: ReadonlyKeyValueWrapper<string> =
    gameMessages.descriptions;

  private static tooltipsStore: ReadonlyKeyValueWrapper<string> =
    gameMessages.tooltips;

  private static labelsStore: ReadonlyKeyValueWrapper<string> =
    gameMessages.labels;

  public static get errorMessages(): ReadonlyKeyValueWrapper<string> {
    return GameStringsStore.errorMessagesStore;
  }

  public static get descriptions(): ReadonlyKeyValueWrapper<string> {
    return GameStringsStore.descriptionsStore;
  }

  public static get tooltips(): ReadonlyKeyValueWrapper<string> {
    return GameStringsStore.tooltipsStore;
  }

  public static get labels(): ReadonlyKeyValueWrapper<string> {
    return GameStringsStore.labelsStore;
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

  public static createStartedLockPickingMessage(): string {
    return GameStringsStore.logMessagesStore['startLockPickingMessage'];
  }

  public static createLockPickMovedMessage(direction: string): string {
    return GameStringsStore.logMessagesStore['lockPickMovedMessage'].replace(
      '${direction}',
      direction
    );
  }

  public static createLockPickStuckMessage(direction: string): string {
    return GameStringsStore.logMessagesStore['lockPickStuckMessage'].replace(
      '${direction}',
      direction
    );
  }

  public static createLockPickOpenedMessage(direction: string): string {
    return `${GameStringsStore.createLockPickMovedMessage(direction)} and ${
      GameStringsStore.logMessagesStore['lockPickOpenedMessage']
    }`;
  }

  public static createLockPickJammedMessage(direction: string): string {
    return `${GameStringsStore.createLockPickStuckMessage(direction)} and ${
      GameStringsStore.logMessagesStore['lockPickJammedMessage']
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
    result: CheckResultLiteral
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
      'DENIED',
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
        '${weapon}',
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
        '${weapon}',
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
    through: string,
    destination: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'SCENE',
      actor,
      GameStringsStore.logMessagesStore['sceneMessage']
        .replace('${through}', through)
        .replace('${destination}', destination)
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

  public static createItemReadLogMessage(
    actor: string,
    item: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'READ',
      actor,
      GameStringsStore.logMessagesStore['itemReadMessage'].replace(
        '${item}',
        item
      )
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

  public static createVisibilityChangedLogMessage(
    actor: string,
    visibility: string
  ) {
    return new LogMessageDefinition(
      'VISIBILITY',
      actor,
      GameStringsStore.logMessagesStore['visibilityMessage'].replace(
        '${visibility}',
        visibility
      )
    );
  }

  public static createAPSpentLogMessage(
    actor: string,
    ap: number
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'AP',
      actor,
      GameStringsStore.logMessagesStore['actionPointsSpentMessage'].replace(
        '${actionPointsSpent}',
        ap.toString()
      )
    );
  }

  public static createInsufficientAPLogMessage(
    actor: string,
    required: number
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'AP',
      actor,
      GameStringsStore.logMessagesStore[
        'actionPointsInsufficientMessage'
      ].replace('${actionPointsRequired}', required.toString())
    );
  }

  public static createWearingLogMessage(
    actor: string,
    equipment: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'WEARING',
      actor,
      GameStringsStore.logMessagesStore['wearingMessage'].replace(
        '${armor}',
        equipment
      )
    );
  }

  public static createStripLogMessage(
    actor: string,
    equipment: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'STRIP',
      actor,
      GameStringsStore.logMessagesStore['stripMessage'].replace(
        '${armor}',
        equipment
      )
    );
  }

  public static createCannotDodgeAPLogMessage(
    actor: string,
    dodge: string
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'AP',
      actor,
      GameStringsStore.logMessagesStore['cannotDodgeWithoutAP'].replace(
        '${Dodge}',
        dodge
      )
    );
  }

  public static createSkillOnCooldownLogMessage(
    actor: string,
    skill: string,
    cooldown: number
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'COOLDOWN',
      actor,
      GameStringsStore.logMessagesStore['skillOnCooldown']
        .replace('${skill}', skill)
        .replace('${cooldown}', Math.ceil(cooldown / 1000).toString())
    );
  }

  public static createEngagementTimerLogMessage(
    actor: string,
    cooldown: number
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'COOLDOWN',
      actor,
      GameStringsStore.logMessagesStore['engagementTimer'].replace(
        '${cooldown}',
        Math.ceil(cooldown / 1000).toString()
      )
    );
  }

  public static createSkillDeniedEngagementTimerLogMessage(
    actor: string,
    skillName: string,
    remaining: number
  ): LogMessageDefinition {
    return new LogMessageDefinition(
      'COOLDOWN',
      actor,
      GameStringsStore.logMessagesStore['skillDeniedEngagementTimer']
        .replace('${skill}', skillName)
        .replace('${remaining}', Math.ceil(remaining / 1000).toString())
    );
  }
}
