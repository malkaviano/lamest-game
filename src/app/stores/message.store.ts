import { Injectable } from '@angular/core';

import { MessageMapDefinition } from '../definitions/message-map.definition';

import messageStore from '../../assets/messages.json';

@Injectable({
  providedIn: 'root',
})
export class MessageStore {
  public readonly store: MessageMapDefinition;

  constructor() {
    this.store = messageStore.messages;
  }
}
