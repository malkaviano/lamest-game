export interface SceneStoreInterface {
  readonly scenes: {
    readonly name: string;
    readonly description: string;
    readonly interactives: string[];
    readonly transitions: {
      readonly name: string;
      readonly scene: string;
    }[];
  }[];
}
