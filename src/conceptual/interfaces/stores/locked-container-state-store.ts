export interface LockedContainerStateStoreInterface {
  readonly states: {
    readonly id: string;
    readonly actionables: string[];
    readonly openedState: string;
    readonly lockPicking?: {
      complexity: number;
      maximumTries: number;
    };
  }[];
}
