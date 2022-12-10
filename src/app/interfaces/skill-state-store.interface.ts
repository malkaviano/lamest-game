export interface SkillStateStoreInterface {
  readonly states: {
    readonly interactiveId: string;
    readonly actionable: string;
    readonly maximumTries: number;
    readonly successState: string;
  }[];
}
