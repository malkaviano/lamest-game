export interface MessageStoreInterface {
  readonly messages: {
    readonly id: string;
    readonly options: {
      readonly name: string;
      readonly label: string;
      readonly answer: string;
      readonly change?: string;
    }[];
  }[];
}
