import { merge, Observable } from 'rxjs';

import { LogMessageDefinition } from '@definitions/log-message.definition';
import { LoggerInterface } from '@interfaces/logger.interface';
import { RuleAbstraction } from '@abstractions/rule.abstraction';
import { KeyValueInterface } from '@interfaces/key-value.interface';
import { ActorDodgedInterface } from '@interfaces/actor-dodged.interface';
import { DocumentOpenedInterface } from '@interfaces/document-opened.interface';
import { ReadableInterface } from '@interfaces/readable.interface';
import { ReadRule } from '@rules/read.rule';

export class RulesHub
  implements LoggerInterface, ActorDodgedInterface, DocumentOpenedInterface
{
  public readonly dispatcher: KeyValueInterface<RuleAbstraction>;

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  public readonly actorDodged$: Observable<string>;

  public readonly documentOpened$: Observable<ReadableInterface>;

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

    const readRule = rules.find((r) => r instanceof ReadRule) as ReadRule;

    this.documentOpened$ = readRule?.documentOpened$;
  }
}
