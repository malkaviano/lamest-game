export interface DestroyableStateStoreInterface {
  readonly states: {
    readonly interactiveId: string;
    readonly actionables: string[];
    readonly destroyedState: string;
    readonly hitpoints: number;
  }[];
}
