import { KeyValueInterface } from '../interfaces/key-value.interface';
import { DirectionLiteral } from '../literals/direction.literal';
import { ArrayView } from '../views/array.view';
import {
  ActionableDefinition,
  createActionableDefinition,
} from './actionable.definition';

export const directionsDefinition: KeyValueInterface<ActionableDefinition> = {
  LEFT: createActionableDefinition('INTERACTION', 'LEFT', `Try LEFT`),
  RIGHT: createActionableDefinition('INTERACTION', 'RIGHT', `Try RIGHT`),
  DOWN: createActionableDefinition('INTERACTION', 'DOWN', `Try DOWN`),
  UP: createActionableDefinition('INTERACTION', 'UP', `Try UP`),
};

export const allDirectionsDefinition: ArrayView<ActionableDefinition> =
  new ArrayView([
    directionsDefinition['LEFT'],
    directionsDefinition['RIGHT'],
    directionsDefinition['DOWN'],
    directionsDefinition['UP'],
  ]);

export const directionNamesDefinition: ArrayView<DirectionLiteral> =
  new ArrayView(['LEFT', 'RIGHT', 'UP', 'DOWN']);
