import { EffectTypeLiteral } from '@literals/effect-type.literal';
import { GameSettingsDefinition } from '@definitions/game-settings.definition';

export type SettingsStoreInterface = {
  settings: Omit<GameSettingsDefinition, 'playerEffectDefenses'> & {
    playerEffectDefenses: {
      immunities: EffectTypeLiteral[];
      cures: EffectTypeLiteral[];
      vulnerabilities: EffectTypeLiteral[];
      resistances: EffectTypeLiteral[];
    };
  };
};
