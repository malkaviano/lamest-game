export interface SimpleStateStoreInterface {
  readonly states: {
    readonly interactiveId: string;
    readonly actionables: string[];
  }[];
}
