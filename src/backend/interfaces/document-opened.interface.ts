import { Observable } from 'rxjs';

import { ReadableDefinition } from '@definitions/readable.definition';

export interface DocumentOpenedInterface {
  readonly documentOpened$: Observable<ReadableDefinition>;
}
