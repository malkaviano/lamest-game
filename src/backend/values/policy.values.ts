import { ActionableDefinition } from '@definitions/actionable.definition';
import { ArrayView } from '@wrappers/array.view';
import { InteractiveInterface } from '@interfaces/interactive.interface';

export type PolicyValues = {
  readonly action: ActionableDefinition;
  readonly invisibleInteractives: ArrayView<InteractiveInterface>;
};
