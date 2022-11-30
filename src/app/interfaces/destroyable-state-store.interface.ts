export interface DestroyableStateStoreInterface {
  readonly states: {
    interactiveId: string;
    actionables: string[];
    destroyedState: string;
    hitpoints: number;
  }[];
}
