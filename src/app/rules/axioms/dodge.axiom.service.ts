import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { LogMessageDefinition } from '../../definitions/log-message.definition';
import { LoggerInterface } from '../../interfaces/logger.interface';

@Injectable({
  providedIn: 'root',
})
export class DodgeAxiomService implements LoggerInterface {
  private readonly logMessageProduced: Subject<LogMessageDefinition>;

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;

  constructor() {
    this.logMessageProduced = new Subject();

    this.logMessageProduced$ = this.logMessageProduced.asObservable();
  }
}
