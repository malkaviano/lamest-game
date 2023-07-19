import { GameSettingsValues } from '@values/game-settings.value';
import { ArrayView } from '@wrappers/array.view';
import { SettingsStoreInterface } from '@interfaces/stores/settings-store.interface';

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
      oneDodgeEveryAgiAmount,
      actionPoints,
      ruleCost,
      aiLoopMilliseconds,
      weaponQuality,
      armorPenalty,
      systemSkills,
      unarmedDamage,
      clothArmor,
    } = settingsStore.settings;

    const cures = ArrayView.fromArray(playerEffectDefenses.cures);

    const immunities = ArrayView.fromArray(playerEffectDefenses.immunities);

    const resistances = ArrayView.fromArray(playerEffectDefenses.resistances);

    const vulnerabilities = ArrayView.fromArray(
      playerEffectDefenses.vulnerabilities
    );

    SettingsStore.mSettings = {
      professionPoints,
      intelligencePoints,
      vulnerabilityCoefficient,
      resistanceCoefficient,
      oneDodgeEveryAgiAmount,
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
    };
  }

  public static get settings(): GameSettingsValues {
    return { ...this.mSettings };
  }
}

SettingsStore.initialize(settingsStore as SettingsStoreInterface);
