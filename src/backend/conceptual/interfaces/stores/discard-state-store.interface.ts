export interface DiscardStateStoreInterface {
  readonly states: {
    readonly id: string;
    readonly items: string[];
  }[];
}
