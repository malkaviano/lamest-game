export interface InteractiveStoreInterface {
  readonly interactives: {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly state: string;
    readonly resettable: boolean;
  }[];
}
