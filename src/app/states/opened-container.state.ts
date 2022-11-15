import {
  ActionableDefinition,
  actionableDefinitions,
} from '../definitions/actionable.definition';
import { ArrayView } from '../definitions/array-view.definition';
import { ClosedContainerState } from './closed-container.state';
import { InteractiveState } from './interactive.state';

export class OpenedContainerState extends InteractiveState {
  constructor(public readonly items: ArrayView<unknown>) {
    super('ContainerOpenedState', [
      actionableDefinitions['CLOSE'],
      actionableDefinitions['PICK'],
    ]);
  }

  public override execute(action: ActionableDefinition): InteractiveState {
    switch (action.name) {
      case 'CLOSE':
        return new ClosedContainerState(this.items);
      case 'PICK':
        // TODO: move items to inventory

        return new OpenedContainerState(new ArrayView([]));
      default:
        throw new Error('Illegal Action Performed');
    }
  }
}
