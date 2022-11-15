import {
  ActionableDefinition,
  actionableDefinitions,
} from '../definitions/actionable.definition';
import { ArrayView } from '../definitions/array-view.definition';
import { InteractiveState } from './interactive.state';
import { OpenedContainerState } from './opened-container.state';

export class ClosedContainerState extends InteractiveState {
  constructor(public readonly items: ArrayView<unknown>) {
    super('ContainerClosedState', [actionableDefinitions['OPEN']]);
  }

  public override execute(action: ActionableDefinition): InteractiveState {
    if (action.name !== 'OPEN') {
      throw new Error('Illegal Action Performed');
    }

    return new OpenedContainerState(this.items);
  }
}
