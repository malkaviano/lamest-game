import { merge, Observable } from 'rxjs';

import { ActivationAxiom } from '../../core/axioms/activation.axiom';
import { AffectAxiom } from '../../core/axioms/affect.axiom';
import { DodgeAxiom } from '../../core/axioms/dodge.axiom';
import { ReadAxiom } from '../../core/axioms/read.axiom';
import { LogMessageDefinition } from '../../core/definitions/log-message.definition';
import { ActorDodgedInterface } from '../../core/interfaces/actor-dodged.interface';
import { DocumentOpenedInterface } from '../../core/interfaces/document-opened.interface';
import { LoggerInterface } from '../../core/interfaces/logger.interface';
import { ReadableInterface } from '../../core/interfaces/readable.interface';
import { RulesHub } from './rules.hub';
import { RollHelper } from '../../core/helpers/roll.helper';

export class EventsHub
  implements LoggerInterface, ActorDodgedInterface, DocumentOpenedInterface
{
  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  public readonly actorDodged$: Observable<string>;

  public readonly documentOpened$: Observable<ReadableInterface>;

  constructor(
    rollService: RollHelper,
    ruleDispatcherService: RulesHub,
    dodgeAxiomService: DodgeAxiom,
    activationAxiomService: ActivationAxiom,
    affectAxiomService: AffectAxiom,
    readAxiomService: ReadAxiom
  ) {
    this.logMessageProduced$ = merge(
      ruleDispatcherService.logMessageProduced$,
      dodgeAxiomService.logMessageProduced$,
      activationAxiomService.logMessageProduced$,
      affectAxiomService.logMessageProduced$,
      rollService.logMessageProduced$
    );

    this.actorDodged$ = dodgeAxiomService.actorDodged$;

    this.documentOpened$ = readAxiomService.documentOpened$;
  }
}
