import { Observable } from 'rxjs';

import { LogMessageDefinition } from '@definitions/log-message.definition';

export interface LoggerInterface {
  readonly logMessageProduced$: Observable<LogMessageDefinition>;
}
