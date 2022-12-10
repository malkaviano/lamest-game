export interface ConversationStateStoreInterface {
  readonly states: {
    readonly interactiveId: string;
    readonly maps: string[];
    readonly initialMap: string;
  }[];
}
