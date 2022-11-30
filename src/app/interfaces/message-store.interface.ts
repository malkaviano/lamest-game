export interface MessageStoreInterface {
  messages: {
    id: string;
    options: {
      name: string;
      label: string;
      answer: string;
      change?: string;
    }[];
  }[];
}
