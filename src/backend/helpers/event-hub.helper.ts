import { Injectable } from '@angular/core';

import { merge, Observable } from 'rxjs';

import { ActivationAxiom } from '../axioms/activation.axiom';
import { AffectAxiom } from '../axioms/affect.axiom';
import { DodgeAxiom } from '../axioms/dodge.axiom';
import { ReadAxiom } from '../axioms/read.axiom';
import { LogMessageDefinition } from '../../core/definitions/log-message.definition';
import { ActorDodgedInterface } from '../../core/interfaces/actor-dodged.interface';
import { DocumentOpenedInterface } from '../../core/interfaces/document-opened.interface';
import { LoggerInterface } from '../../core/interfaces/logger.interface';
import { ReadableInterface } from '../../core/interfaces/readable.interface';
import { RollService } from '../services/roll.service';
import { RuleDispatcherService } from '../services/rule-dispatcher.service';

@Injectable({
  providedIn: 'root',
})
export class EventHubHelperService
  implements LoggerInterface, ActorDodgedInterface, DocumentOpenedInterface
{
  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  public readonly actorDodged$: Observable<string>;

  public readonly documentOpened$: Observable<ReadableInterface>;

  constructor(
    rollService: RollService,
    ruleDispatcherService: RuleDispatcherService,
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
