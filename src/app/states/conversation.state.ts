import {
  ActionableDefinition,
  actionableDefinitions,
} from '../definitions/actionable.definition';
import { errorMessages } from '../definitions/error-messages.definition';
import { LogMessage } from '../definitions/log-message.definition';
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

  public execute(action: ActionableDefinition): {
    state: InteractiveState;
    log: LogMessage;
  } {
    if (action.action !== 'ASK') {
      throw new Error(errorMessages['WRONG-ACTION']);
    }

    const response = this.currentMessages[action.name];

    if (!response) {
      throw new Error(errorMessages['UNKNOWN-MESSAGE']);
    }

    return {
      state: new ConversationState(
        this.entityId,
        this.messageMap,
        response.change ?? this.currentMap
      ),
      log: new LogMessage(action, response.answer),
    };
  }
}
