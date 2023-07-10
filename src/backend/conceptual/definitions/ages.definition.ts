import { AgeLiteral } from '@literals/age.literal';
import { ArrayView } from '@wrappers/array.view';

export const ages: ArrayView<AgeLiteral> = ArrayView.create(
  'YOUNG',
  'ADULT',
  'VETERAN'
);
