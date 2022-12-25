import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { ReadableDefinition } from '../definitions/readable.definition';
import { DocumentOpenedInterface } from '../interfaces/document-opened.interface';
import { ReadableInterface } from '../interfaces/readable.interface';

@Injectable({
  providedIn: 'root',
})
export class ReadAxiomService implements DocumentOpenedInterface {
  private readonly documentOpened: Subject<ReadableInterface>;

  public readonly documentOpened$: Observable<ReadableInterface>;

  constructor() {
    this.documentOpened = new Subject();

    this.documentOpened$ = this.documentOpened.asObservable();
  }

  public readDocument(item: ReadableDefinition): void {
    this.documentOpened.next({
      title: item.title,
      text: item.text,
    });
  }
}
