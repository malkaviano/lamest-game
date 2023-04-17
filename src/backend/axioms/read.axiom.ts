import { Observable, Subject } from 'rxjs';

import { ReadableDefinition } from '../../core/definitions/readable.definition';
import { DocumentOpenedInterface } from '../../core/interfaces/document-opened.interface';
import { ReadableInterface } from '../../core/interfaces/readable.interface';

export class ReadAxiom implements DocumentOpenedInterface {
  private readonly documentOpened: Subject<ReadableInterface>;

  public readonly documentOpened$: Observable<ReadableInterface>;

  constructor() {
    this.documentOpened = new Subject();

    this.documentOpened$ = this.documentOpened.asObservable();
  }

  public openDocument(item: ReadableDefinition): void {
    this.documentOpened.next({
      title: item.title,
      text: item.text,
    });
  }
}
