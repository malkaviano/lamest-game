export interface SceneStoreInterface {
  readonly scenes: {
    readonly name: string;
    readonly label: string;
    readonly interactives: string[];
    readonly image: string;
  }[];
  readonly initial: string;
  readonly transitions: {
    readonly sceneA: string;
    readonly sceneB: string;
    readonly name: string;
    readonly label: string;
  }[];
}
