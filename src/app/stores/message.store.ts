import { Injectable } from '@angular/core';

import { MessageMapDefinition } from '../definitions/message-map.definition';

@Injectable({
  providedIn: 'root',
})
export class MessageStore {
  public readonly store: MessageMapDefinition;

  constructor() {
    this.store = {
      map1: {
        strange: {
          label: 'Strange sights',
          answer: 'I did see nothing',
        },
        things: {
          label: 'How are things',
          answer: 'So so, day by day',
        },
        bar: {
          label: 'Next bar',
          answer: 'Around the corner',
          change: 'map2',
        },
      },
      map2: {
        drink: {
          label: 'Want a drink?',
          answer: 'Fuck off',
          change: 'map1',
        },
      },
    };
  }
}
