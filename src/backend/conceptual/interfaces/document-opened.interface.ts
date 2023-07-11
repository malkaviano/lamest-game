import { Observable } from 'rxjs';

import { ReadableInterface } from '@interfaces/readable.interface';

export interface DocumentOpenedInterface {
  readonly documentOpened$: Observable<ReadableInterface>;
}
