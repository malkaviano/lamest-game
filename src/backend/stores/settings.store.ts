import { GameSettingsValues } from '@values/game-settings.value';
import { ArrayView } from '@wrappers/array.view';
import { SettingsStoreInterface } from '@interfaces/stores/settings-store.interface';
import { RuleNameLiteral } from '@literals/rule-name.literal';

import settingsStore from '@assets/settings.json';

export class SettingsStore {
  private static mSettings: GameSettingsValues;

  public static initialize(settingsStore: SettingsStoreInterface) {
    const {
      professionPoints,
      intelligencePoints,
      vulnerabilityCoefficient,
      resistanceCoefficient,
      playerEffectDefenses,
      dodgeAPCost,
      actionPoints,
      ruleCost,
      aiLoopMilliseconds,
      weaponQuality,
      armorPenalty,
      systemSkills,
      unarmedDamage,
      clothArmor,
      skillCheck,
      visibilityBreak,
      timersInMilliseconds,
    } = settingsStore.settings;

    const cures = ArrayView.fromArray(playerEffectDefenses.cures);

    const immunities = ArrayView.fromArray(playerEffectDefenses.immunities);

    const resistances = ArrayView.fromArray(playerEffectDefenses.resistances);

    const vulnerabilities = ArrayView.fromArray(
      playerEffectDefenses.vulnerabilities
    );

    const onVisibilityBreak = {
      actor: {
        disguised: ArrayView.fromArray<RuleNameLiteral>(
          visibilityBreak.actor.disguised
        ),
        hidden: ArrayView.fromArray<RuleNameLiteral>(
          visibilityBreak.actor.hidden
        ),
      },
      target: {
        disguised: ArrayView.fromArray<RuleNameLiteral>(
          visibilityBreak.target.disguised
        ),
        hidden: ArrayView.fromArray<RuleNameLiteral>(
          visibilityBreak.target.hidden
        ),
      },
    };

    SettingsStore.mSettings = {
      professionPoints,
      intelligencePoints,
      vulnerabilityCoefficient,
      resistanceCoefficient,
      dodgeAPCost,
      playerEffectDefenses: {
        cures,
        immunities,
        resistances,
        vulnerabilities,
      },
      actionPoints,
      ruleCost,
      aiLoopMilliseconds,
      weaponQuality,
      armorPenalty,
      systemSkills,
      unarmedDamage,
      clothArmor,
      skillCheck,
      visibilityBreak: onVisibilityBreak,
      timersInMilliseconds,
    };
  }

  public static get settings(): GameSettingsValues {
    return { ...this.mSettings };
  }
}

SettingsStore.initialize(settingsStore as SettingsStoreInterface);
