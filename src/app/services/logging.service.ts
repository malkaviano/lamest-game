import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  private readonly gameLog: Subject<string>;

  public readonly gameLog$: Observable<string>;

  constructor() {
    this.gameLog = new Subject<string>();

    this.gameLog$ = this.gameLog.asObservable();
  }

  public log(msg: string): void {
    this.gameLog.next(msg);
  }
}
