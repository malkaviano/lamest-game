import { Observable } from 'rxjs';

import { DodgeAxiom } from '../../core/axioms/dodge.axiom';
import { ReadAxiom } from '../../core/axioms/read.axiom';
import { ActorDodgedInterface } from '../../core/interfaces/actor-dodged.interface';
import { DocumentOpenedInterface } from '../../core/interfaces/document-opened.interface';
import { ReadableInterface } from '../../core/interfaces/readable.interface';

export class EventsHub
  implements ActorDodgedInterface, DocumentOpenedInterface
{
  public readonly actorDodged$: Observable<string>;

  public readonly documentOpened$: Observable<ReadableInterface>;

  constructor(dodgeAxiomService: DodgeAxiom, readAxiomService: ReadAxiom) {
    this.actorDodged$ = dodgeAxiomService.actorDodged$;

    this.documentOpened$ = readAxiomService.documentOpened$;
  }
}
