import { KeyValueInterface } from '@interfaces/key-value.interface';

export type MessageMapDefinition = KeyValueInterface<
  KeyValueInterface<{ label: string; answer: string; change?: string }>
>;
