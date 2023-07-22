import { GameSettingsValues } from '@values/game-settings.value';
import { ArrayView } from '@wrappers/array.view';
import { SettingsStoreInterface } from '@interfaces/stores/settings-store.interface';

import settingsStore from '@assets/settings.json';
import { RuleNameLiteral } from '../conceptual/literals/rule-name.literal';

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
      actorVisibilityBreak,
    } = settingsStore.settings;

    const cures = ArrayView.fromArray(playerEffectDefenses.cures);

    const immunities = ArrayView.fromArray(playerEffectDefenses.immunities);

    const resistances = ArrayView.fromArray(playerEffectDefenses.resistances);

    const vulnerabilities = ArrayView.fromArray(
      playerEffectDefenses.vulnerabilities
    );

    const actorVisibilityBreakOn = {
      disguised: ArrayView.fromArray<RuleNameLiteral>(
        actorVisibilityBreak.disguised
      ),
      hidden: ArrayView.fromArray<RuleNameLiteral>(actorVisibilityBreak.hidden),
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
      actorVisibilityBreak: actorVisibilityBreakOn,
    };
  }

  public static get settings(): GameSettingsValues {
    return { ...this.mSettings };
  }
}

SettingsStore.initialize(settingsStore as SettingsStoreInterface);
