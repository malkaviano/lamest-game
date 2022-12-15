export interface DescriptionStoreInterface {
  readonly descriptions: {
    readonly sceneName: string;
    readonly paragraphs: string[];
  }[];
}
