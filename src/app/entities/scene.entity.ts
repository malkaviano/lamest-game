import { ResultLiteral } from '../literals/result.literal';
import { ArrayView } from '../views/array.view';
import { InteractiveEntity } from './interactive.entity';
import { errorMessages } from '../definitions/error-messages.definition';
import { ActionableEvent } from '../events/actionable.event';
import { KeyValueInterface } from '../interfaces/key-value.interface';

export class SceneEntity {
  constructor(
    public readonly description: ArrayView<string>,
    public readonly interactives: ArrayView<InteractiveEntity>,
    public readonly transitions: KeyValueInterface<string>
  ) {}

  public run(
    action: ActionableEvent,
    result: ResultLiteral
  ): InteractiveEntity {
    const interactive = this.interactives.items.find(
      (i) => i.id === action.eventId
    );

    if (!interactive) {
      throw new Error(errorMessages['SHOULD-NOT-HAPPEN']);
    }

    interactive.actionSelected(action.actionableDefinition, result);

    return interactive;
  }

  public reset(): void {
    this.interactives.items.forEach((i) => i.reset());
  }
}
