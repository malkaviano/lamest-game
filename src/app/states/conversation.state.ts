import {
  ActionableDefinition,
  actionableDefinitions,
} from '../definitions/actionable.definition';
import { ActionLogDefinition } from '../definitions/action-log.definition';
import { StateResult } from '../results/state.result';
import { InteractiveState } from './interactive.state';

export type ConversationMessageMap = {
  [key: string]: {
    [key: string]: { label: string; answer: string; change?: string };
  };
};

export class ConversationState extends InteractiveState {
  protected readonly currentMessages: {
    [key: string]: { label: string; answer: string; change?: string };
  };

  constructor(
    entityId: string,
    protected readonly messageMap: ConversationMessageMap,
    protected readonly currentMap: string
  ) {
    const currentMessages = messageMap[currentMap];

    const actions = Object.keys(currentMessages).map((topic) =>
      actionableDefinitions['ASK'](
        entityId,
        topic,
        currentMessages[topic].label
      )
    );

    super(entityId, 'ConversationState', actions);

    this.currentMessages = currentMessages;
  }

  protected stateResult(action: ActionableDefinition): StateResult {
    const response = this.currentMessages[action.name];

    return new StateResult(
      new ConversationState(
        this.entityId,
        this.messageMap,
        response.change ?? this.currentMap
      ),
      new ActionLogDefinition(action.label, response.answer)
    );
  }
}