export interface DestroyableStateStoreInterface {
  readonly states: {
    readonly id: string;
    readonly destroyedState: string;
    readonly hitpoints: number;
  }[];
}
