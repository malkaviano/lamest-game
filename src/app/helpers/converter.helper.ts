import { Injectable } from '@angular/core';

import { KeyValueInterface } from '../interfaces/key-value.interface';

@Injectable({
  providedIn: 'root',
})
export class ConverterHelper {
  public mapToKeyValueInterface<Value>(
    obj: Map<string, Value>
  ): KeyValueInterface<Value> {
    return Array.from(obj.entries()).reduce(
      (acc: { [key: string]: Value }, [k, v]) => {
        acc[k] = v;

        return acc;
      },
      {}
    );
  }
}
