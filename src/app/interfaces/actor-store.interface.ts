export interface ActorStoreInterface {
  readonly actors: {
    id: string;
    name: string;
    description: string;
    state: string;
    resettable: boolean;
  }[];
}
