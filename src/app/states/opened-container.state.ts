import {
  ActionableDefinition,
  actionableDefinitions,
} from '../definitions/actionable.definition';
import { ArrayView } from '../definitions/array-view.definition';
import { ClosedContainerState } from './closed-container.state';
import { InteractiveState } from './interactive.state';

export class OpenedContainerState extends InteractiveState {
  constructor(entityId: string, public readonly items: ArrayView<unknown>) {
    super(entityId, 'ContainerOpenedState', [
      actionableDefinitions['CLOSE'](entityId, 'Close'),
      actionableDefinitions['PICK'](entityId, 'Pick'),
    ]);
  }

  public override execute(action: ActionableDefinition): InteractiveState {
    switch (action.action) {
      case 'CLOSE':
        return new ClosedContainerState(this.entityId, this.items);
      case 'PICK':
        // TODO: move items to inventory

        return new OpenedContainerState(this.entityId, new ArrayView([]));
      default:
        throw new Error('Illegal Action Performed');
    }
  }
}
