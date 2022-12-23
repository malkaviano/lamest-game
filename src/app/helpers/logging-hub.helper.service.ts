import { Injectable } from '@angular/core';

import { merge, Observable } from 'rxjs';

import { LogMessageDefinition } from '../definitions/log-message.definition';
import { LoggerInterface } from '../interfaces/logger.interface';
import { ActivationAxiomService } from '../rules/axioms/activation.axiom.service';
import { RuleDispatcherService } from '../services/rule-dispatcher.service';

@Injectable({
  providedIn: 'root',
})
export class LoggingHubHelperService implements LoggerInterface {
  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  constructor(
    ruleDispatcherService: RuleDispatcherService,
    activationAxiom: ActivationAxiomService
  ) {
    this.logMessageProduced$ = merge(
      ruleDispatcherService.logMessageProduced$,
      activationAxiom.logMessageProduced$
    );
  }
}
