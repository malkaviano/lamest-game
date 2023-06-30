import { merge, Observable } from 'rxjs';

import { LogMessageDefinition } from '../../core/definitions/log-message.definition';
import { LoggerInterface } from '../../core/interfaces/logger.interface';
import { MasterRule } from '../rules/master.rule';
import { KeyValueInterface } from '../../core/interfaces/key-value.interface';

export class RulesHub implements LoggerInterface {
  public readonly dispatcher: KeyValueInterface<MasterRule>;

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  constructor(...rules: MasterRule[]) {
    this.dispatcher = rules.reduce((acc: { [key: string]: MasterRule }, r) => {
      acc[r.name] = r;

      return acc;
    }, {});

    this.logMessageProduced$ = merge(
      ...rules.map((r) => r.logMessageProduced$)
    );
  }
}
