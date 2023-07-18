import { merge, Observable } from 'rxjs';

import { LogMessageDefinition } from '@definitions/log-message.definition';
import { LoggerInterface } from '@interfaces/logger.interface';
import { RuleAbstraction } from '@abstractions/rule.abstraction';
import { ReadonlyKeyValueWrapper } from '@wrappers/key-value.wrapper';
import { ActorDodgedInterface } from '@interfaces/actor-dodged.interface';
import { DocumentOpenedInterface } from '@interfaces/document-opened.interface';
import { ReadableDefinition } from '@definitions/readable.definition';

export class RulesHub
  implements LoggerInterface, ActorDodgedInterface, DocumentOpenedInterface
{
  public readonly dispatcher: ReadonlyKeyValueWrapper<RuleAbstraction>;

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  public readonly actorDodged$: Observable<string>;

  public readonly documentOpened$: Observable<ReadableDefinition>;

  constructor(...rules: RuleAbstraction[]) {
    this.dispatcher = rules.reduce(
      (acc: { [key: string]: RuleAbstraction }, r) => {
        acc[r.name] = r;

        return acc;
      },
      {}
    );

    this.logMessageProduced$ = merge(
      ...rules.map((r) => r.logMessageProduced$)
    );

    this.actorDodged$ = merge(...rules.map((r) => r.actorDodged$));

    this.documentOpened$ = merge(...rules.map((r) => r.documentOpened$));
  }
}
