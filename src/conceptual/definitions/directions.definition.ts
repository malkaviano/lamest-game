import { DirectionLiteral } from '@literals/direction.literal';
import { ArrayView } from '../view-models/array.view';
import { createActionableDefinition } from './actionable.definition';

export const directionActionableDefinition = (
  direction: DirectionLiteral,
  label: string
) => createActionableDefinition('INTERACTION', direction, label);

export const directionNamesDefinition: ArrayView<DirectionLiteral> =
  ArrayView.create('LEFT', 'RIGHT', 'UP', 'DOWN');
