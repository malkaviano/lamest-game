export interface SimpleStateStoreInterface {
  readonly states: {
    interactiveId: string;
    actionables: string[];
  }[];
}
