export interface DiscardStateStoreInterface {
  readonly states: {
    readonly interactiveId: string;
    readonly actionables: string[];
  }[];
}
