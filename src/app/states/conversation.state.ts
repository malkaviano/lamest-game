import {
  ActionableDefinition,
  createActionableDefinition,
} from '../definitions/actionable.definition';
import { ResultLiteral } from '../literals/result.literal';
import { ActionableState } from './actionable.state';

export type ConversationMessageMap = {
  [key: string]: {
    [key: string]: { label: string; answer: string; change?: string };
  };
};

export class ConversationState extends ActionableState {
  protected readonly currentMessages: {
    [key: string]: { label: string; answer: string; change?: string };
  };

  constructor(
    protected readonly messageMap: ConversationMessageMap,
    protected readonly currentMap: string
  ) {
    const currentMessages = messageMap[currentMap];

    const actions = Object.keys(currentMessages).map((topic) =>
      createActionableDefinition('ASK', topic, currentMessages[topic].label)
    );

    super('ConversationState', actions);

    this.currentMessages = currentMessages;
  }

  protected override stateResult(
    action: ActionableDefinition,
    result: ResultLiteral
  ): ActionableState {
    const response = this.currentMessages[action.name];

    return new ConversationState(
      this.messageMap,
      response.change ?? this.currentMap
    );
  }
}
