export interface ConversationStateStoreInterface {
  readonly states: {
    readonly id: string;
    readonly maps: string[];
    readonly initialMap: string;
  }[];
}
