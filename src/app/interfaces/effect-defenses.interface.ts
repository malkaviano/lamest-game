import { EffectTypeLiteral } from '../literals/effect-type.literal';
import { ArrayView } from '../views/array.view';

export interface EffectDefensesInterface {
  readonly immunities: ArrayView<EffectTypeLiteral>;
  readonly cures: ArrayView<EffectTypeLiteral>;
  readonly vulnerabilities: ArrayView<EffectTypeLiteral>;
  readonly resistances: ArrayView<EffectTypeLiteral>;
}
