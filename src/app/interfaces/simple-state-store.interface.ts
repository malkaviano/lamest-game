export interface SimpleStateStoreInterface {
  readonly states: {
    readonly id: string;
    readonly actionables: string[];
  }[];
}
