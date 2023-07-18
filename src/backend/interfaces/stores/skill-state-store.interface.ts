export interface SkillStateStoreInterface {
  readonly states: {
    readonly id: string;
    readonly skillName: string;
    readonly maximumTries: number;
    readonly successState: string;
  }[];
}
