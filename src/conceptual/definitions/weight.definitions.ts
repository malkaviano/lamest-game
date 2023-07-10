import { WeightLiteral } from '@literals/weight.literal';
import { ArrayView } from '../view-models/array.view';

export const weights: ArrayView<WeightLiteral> = ArrayView.create(
  'LIGHT',
  'AVERAGE',
  'HEAVY'
);
