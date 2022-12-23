import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { LogMessageDefinition } from '../../definitions/log-message.definition';
import { LoggerInterface } from '../../interfaces/logger.interface';
import { ActivationAxiomService } from './activation.axiom.service';

@Injectable({
  providedIn: 'root',
})
export class AxiomHubService implements LoggerInterface {
  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  constructor(activationAxiom: ActivationAxiomService) {
    this.logMessageProduced$ = activationAxiom.logMessageProduced$;
  }
}
