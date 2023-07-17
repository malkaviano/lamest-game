import { EffectTypeLiteral } from '@literals/effect-type.literal';
import { GameSettingsInterface } from '@interfaces/game-settings.interface';

export type SettingsStoreInterface = {
  settings: Omit<GameSettingsInterface, 'playerEffectDefenses'> & {
    playerEffectDefenses: {
      immunities: EffectTypeLiteral[];
      cures: EffectTypeLiteral[];
      vulnerabilities: EffectTypeLiteral[];
      resistances: EffectTypeLiteral[];
    };
  };
};
