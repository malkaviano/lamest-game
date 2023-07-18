import { EffectTypeLiteral } from '@literals/effect-type.literal';
import { GameSettingsValues } from '@values/game-settings.value';

export type SettingsStoreInterface = {
  settings: Omit<GameSettingsValues, 'playerEffectDefenses'> & {
    playerEffectDefenses: {
      immunities: EffectTypeLiteral[];
      cures: EffectTypeLiteral[];
      vulnerabilities: EffectTypeLiteral[];
      resistances: EffectTypeLiteral[];
    };
  };
};
