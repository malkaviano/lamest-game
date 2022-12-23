import { Observable } from 'rxjs';

import { ReadableInterface } from './readable.interface';

export interface DocumentOpenedInterface {
  readonly documentOpened$: Observable<ReadableInterface>;
}
