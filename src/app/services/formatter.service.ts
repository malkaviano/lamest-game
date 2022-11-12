import { Injectable } from '@angular/core';

import { KeyValueDescription } from '../definitions/key-value-description.definition';

@Injectable({
  providedIn: 'root',
})
export class FormatterService {
  public toKeyValueDescription(obj: {
    key: string;
    value: number;
    description: string;
  }): KeyValueDescription {
    return new KeyValueDescription(
      obj.key,
      obj.value.toString(),
      obj.description
    );
  }
}
