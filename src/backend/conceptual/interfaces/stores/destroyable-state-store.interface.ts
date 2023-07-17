export interface DestroyableStateStoreInterface {
  readonly states: {
    readonly id: string;
    readonly lootState: string;
    readonly hitpoints: number;
  }[];
}
