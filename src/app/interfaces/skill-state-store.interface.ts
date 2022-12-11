export interface SkillStateStoreInterface {
  readonly states: {
    readonly id: string;
    readonly actionable: string;
    readonly maximumTries: number;
    readonly successState: string;
  }[];
}
