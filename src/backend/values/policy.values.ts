import { ArrayView } from '@wrappers/array.view';
import { InteractiveInterface } from '@interfaces/interactive.interface';

export type PolicyValues = {
  readonly invisibleInteractives: ArrayView<InteractiveInterface>;
};
