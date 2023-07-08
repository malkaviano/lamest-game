import { GameSettingsInterface } from '../core/interfaces/game-settings.interface';
import { ArrayView } from '../core/view-models/array.view';
import { EffectTypeLiteral } from '../core/literals/effect-type.literal';
import { SettingsStoreInterface } from '../core/interfaces/stores/settings-store.interface';

import settingsStore from '../assets/settings.json';

export class SettingsStore {
  private static mSettings: GameSettingsInterface;

  public static initialize(settingsStore: SettingsStoreInterface) {
    const {
      professionPoints,
      intelligencePoints,
      vulnerabilityCoefficient,
      resistanceCoefficient,
      playerEffectDefenses,
      oneDodgeEveryAgiAmount,
      actionCooldown,
    } = settingsStore.settings;

    const cures = ArrayView.fromArray(
      playerEffectDefenses.cures.map((e) => e as EffectTypeLiteral)
    );

    const immunities = ArrayView.fromArray(
      playerEffectDefenses.immunities.map((e) => e as EffectTypeLiteral)
    );

    const resistances = ArrayView.fromArray(
      playerEffectDefenses.resistances.map((e) => e as EffectTypeLiteral)
    );

    const vulnerabilities = ArrayView.fromArray(
      playerEffectDefenses.vulnerabilities.map((e) => e as EffectTypeLiteral)
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
      actionCooldown,
    };
  }

  public static get settings(): GameSettingsInterface {
    return Object.assign({}, this.mSettings);
  }
}

SettingsStore.initialize(settingsStore as SettingsStoreInterface);
