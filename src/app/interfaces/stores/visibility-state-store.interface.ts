export interface VisibilityStateStoreInterface {
  readonly states: {
    readonly id: string;
    readonly actionable: string;
    readonly maximumTries: number;
  }[];
}
