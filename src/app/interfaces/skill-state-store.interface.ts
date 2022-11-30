export interface SkillStateStoreInterface {
  readonly states: {
    interactiveId: string;
    actionable: string;
    maximumTries: number;
    successState: string;
  }[];
}
