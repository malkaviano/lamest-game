export interface ConversationStateStoreInterface {
  readonly states: {
    interactiveId: string;
    maps: string[];
    initialMap: string;
  }[];
}
