import {
  ActionableDefinition,
  createActionableDefinition,
} from '../definitions/actionable.definition';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { MessageMapDefinition } from '../definitions/message-map.definition';
import { ActionableState } from './actionable.state';
import { ArrayView } from '../view-models/array.view';

export class ConversationState extends ActionableState {
  protected readonly currentMessages: KeyValueInterface<{
    label: string;
    answer: string;
    change?: string;
  }>;

  constructor(
    protected readonly messageMap: MessageMapDefinition,
    protected readonly currentMap: string
  ) {
    const currentMessages = messageMap[currentMap];

    const actions = Object.keys(currentMessages).map((topic) =>
      createActionableDefinition(
        'INTERACTION',
        topic,
        currentMessages[topic].label
      )
    );
    super('ConversationState', ArrayView.fromArray(actions));

    this.currentMessages = currentMessages;
  }

  protected override stateResult(action: ActionableDefinition): {
    state: ActionableState;
    log?: string;
  } {
    const response = this.currentMessages[action.name];

    return {
      state: new ConversationState(
        this.messageMap,
        response.change ?? this.currentMap
      ),
      log: response.answer,
    };
  }
}
