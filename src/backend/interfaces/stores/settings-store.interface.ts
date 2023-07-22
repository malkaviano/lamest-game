import { EffectTypeLiteral } from '@literals/effect-type.literal';
import { GameSettingsValues } from '@values/game-settings.value';
import { RuleNameLiteral } from '@literals/rule-name.literal';

export type SettingsStoreInterface = {
  settings: Omit<
    GameSettingsValues,
    'playerEffectDefenses' | 'visibilityBreak'
  > & {
    readonly playerEffectDefenses: {
      readonly immunities: EffectTypeLiteral[];
      readonly cures: EffectTypeLiteral[];
      readonly vulnerabilities: EffectTypeLiteral[];
      readonly resistances: EffectTypeLiteral[];
    };
    readonly visibilityBreak: {
      readonly actor: {
        readonly disguised: RuleNameLiteral[];
        readonly hidden: RuleNameLiteral[];
      };
      readonly target: {
        readonly disguised: RuleNameLiteral[];
        readonly hidden: RuleNameLiteral[];
      };
    };
  };
};
