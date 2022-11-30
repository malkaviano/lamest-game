export interface SceneStoreInterface {
  readonly scenes: {
    name: string;
    description: string;
    interactives: string[];
    transitions: {
      name: string;
      scene: string;
    }[];
  }[];
}
