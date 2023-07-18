import { ReadonlyKeyValueWrapper } from '@wrappers/key-value.wrapper';

export type MessageMapDefinition = ReadonlyKeyValueWrapper<
  ReadonlyKeyValueWrapper<{ label: string; answer: string; change?: string }>
>;
