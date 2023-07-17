export interface SceneStoreInterface {
  readonly scenes: {
    readonly name: string;
    readonly label: string;
    readonly interactives: string[];
    readonly transitions: {
      readonly name: string;
      readonly label: string;
      readonly scene: string;
    }[];
    readonly image: string;
  }[];
  readonly initial: string;
}
