export interface DiscardStateStoreInterface {
  readonly states: {
    interactiveId: string;
    actionables: string[];
  }[];
}
