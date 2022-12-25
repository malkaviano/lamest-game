import { Injectable } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { ActivationAxiomService } from '../axioms/activation.axiom.service';
import { AffectAxiomService } from '../axioms/affect.axiom.service';
import { DodgeAxiomService } from '../axioms/dodge.axiom.service';
import { ReadAxiomService } from '../axioms/read.axiom.service';
import { LogMessageDefinition } from '../definitions/log-message.definition';
import { ActorDodgedInterface } from '../interfaces/actor-dodged.interface';
import { DocumentOpenedInterface } from '../interfaces/document-opened.interface';
import { LoggerInterface } from '../interfaces/logger.interface';
import { ReadableInterface } from '../interfaces/readable.interface';
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
    dodgeAxiomService: DodgeAxiomService,
    activationAxiomService: ActivationAxiomService,
    affectAxiomService: AffectAxiomService,
    readAxiomService: ReadAxiomService
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
