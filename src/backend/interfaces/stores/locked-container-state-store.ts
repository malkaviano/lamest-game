export interface LockedContainerStateStoreInterface {
  readonly states: {
    readonly id: string;
    readonly keyName: string;
    readonly openedState: string;
    readonly lockPicking?: {
      complexity: number;
      maximumTries: number;
    };
  }[];
}
