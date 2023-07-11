import { DirectionLiteral } from '@literals/direction.literal';
import { ArrayView } from '@wrappers/array.view';
import { createActionableDefinition } from '@definitions/actionable.definition';

export const directionActionableDefinition = (
  direction: DirectionLiteral,
  label: string
) => createActionableDefinition('INTERACTION', direction, label);

export const directionNamesDefinition: ArrayView<DirectionLiteral> =
  ArrayView.create('LEFT', 'RIGHT', 'UP', 'DOWN');
