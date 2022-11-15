import {
  ActionableDefinition,
  actionableDefinitions,
} from '../definitions/actionable.definition';
import { ArrayView } from '../definitions/array-view.definition';
import { InteractiveState } from './interactive.state';
import { OpenedContainerState } from './opened-container.state';

export class ClosedContainerState extends InteractiveState {
  constructor(entityId: string, public readonly items: ArrayView<unknown>) {
    super(entityId, 'ContainerClosedState', [
      actionableDefinitions['OPEN'](entityId, 'Open'),
    ]);
  }

  public override execute(action: ActionableDefinition): InteractiveState {
    if (action.action !== 'OPEN') {
      throw new Error('Illegal Action Performed');
    }

    return new OpenedContainerState(this.entityId, this.items);
  }
}
