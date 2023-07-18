export interface KeyValueWrapper<Value> {
  [key: string]: Value;
}

export type ReadonlyKeyValueWrapper<Value> = Readonly<KeyValueWrapper<Value>>;
