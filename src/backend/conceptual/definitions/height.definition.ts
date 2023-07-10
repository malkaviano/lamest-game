import { HeightLiteral } from '@literals/height.literal';
import { ArrayView } from '@wrappers/array.view';

export const heights: ArrayView<HeightLiteral> = ArrayView.create(
  'SHORT',
  'AVERAGE',
  'TALL'
);
