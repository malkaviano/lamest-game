export interface InteractiveStoreInterface {
  readonly interactives: {
    id: string;
    name: string;
    description: string;
    state: string;
    resettable: boolean;
  }[];
  readonly usedItems: {
    id: string;
    items: {
      name: string;
      quantity: number;
    }[];
  }[];
}
