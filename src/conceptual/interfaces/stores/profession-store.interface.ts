export interface ProfessionStoreInterface {
  readonly professions: {
    readonly name: string;
    readonly skills: string[];
  }[];
}
