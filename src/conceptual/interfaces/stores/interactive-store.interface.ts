export interface InteractiveStoreInterface {
  readonly interactives: {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly state: string;
    readonly resettable: boolean;
  }[];
  readonly inventoryItems: {
    readonly id: string;
    readonly items: {
      readonly name: string;
      readonly quantity: number;
    }[];
  }[];
}
