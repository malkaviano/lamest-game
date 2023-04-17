export interface DiscardStateStoreInterface {
  readonly states: {
    readonly id: string;
    readonly actionables: string[];
  }[];
}
