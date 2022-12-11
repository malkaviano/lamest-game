export interface LockedContainerStateStoreInterface {
  readonly states: {
    readonly id: string;
    readonly actionables: string[];
    readonly openedState: string;
  }[];
}
