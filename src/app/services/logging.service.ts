import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { LogMessageDefinition } from '../definitions/log-message.definition';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  private readonly gameLog: Subject<LogMessageDefinition>;

  public readonly gameLog$: Observable<LogMessageDefinition>;

  constructor() {
    this.gameLog = new Subject<LogMessageDefinition>();

    this.gameLog$ = this.gameLog.asObservable();
  }

  public log(msg: LogMessageDefinition): void {
    this.gameLog.next(msg);
  }
}
