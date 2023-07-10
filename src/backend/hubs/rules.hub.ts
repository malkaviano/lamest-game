import { merge, Observable } from 'rxjs';

import { LogMessageDefinition } from '@core/definitions/log-message.definition';
import { LoggerInterface } from '@core/interfaces/logger.interface';
import { MasterRule } from '../rules/master.rule';
import { KeyValueInterface } from '@core/interfaces/key-value.interface';
import { ActorDodgedInterface } from '@core/interfaces/actor-dodged.interface';
import { AffectRule } from '../rules/affect.rule';
import { DocumentOpenedInterface } from '@core/interfaces/document-opened.interface';
import { ReadableInterface } from '@core/interfaces/readable.interface';
import { ReadRule } from '../rules/read.rule';

export class RulesHub
  implements LoggerInterface, ActorDodgedInterface, DocumentOpenedInterface
{
  public readonly dispatcher: KeyValueInterface<MasterRule>;

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  public readonly actorDodged$: Observable<string>;

  public readonly documentOpened$: Observable<ReadableInterface>;

  constructor(...rules: MasterRule[]) {
    this.dispatcher = rules.reduce((acc: { [key: string]: MasterRule }, r) => {
      acc[r.name] = r;

      return acc;
    }, {});

    this.logMessageProduced$ = merge(
      ...rules.map((r) => r.logMessageProduced$)
    );

    const affectRule = rules.find((r) => r instanceof AffectRule) as AffectRule;

    this.actorDodged$ = affectRule?.actorDodged$;

    const readRule = rules.find((r) => r instanceof ReadRule) as ReadRule;

    this.documentOpened$ = readRule?.documentOpened$;
  }
}
