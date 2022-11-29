import { Injectable } from '@angular/core';

import { InteractiveEntity } from '../entities/interactive.entity';
import { KeyValueInterface } from '../interfaces/key-value.interface';
import { StatesStore } from './states.store';

@Injectable({
  providedIn: 'root',
})
export class InteractiveStore {
  public readonly interactives: KeyValueInterface<InteractiveEntity>;

  public readonly usedItems: KeyValueInterface<KeyValueInterface<number>>;

  constructor(private readonly stateStore: StatesStore) {
    this.interactives = {
      npc1: new InteractiveEntity(
        'npc1',
        'NPC',
        'Some random person',
        this.stateStore.states['npcConversation']
      ),
      sceneExitDoor: new InteractiveEntity(
        'sceneExitDoor',
        'Outside Door',
        'Need some fresh air?',
        this.stateStore.states['exitDoor']
      ),
      upperShelf: new InteractiveEntity(
        'upperShelf',
        'Shelf',
        'Very high on the wall',
        this.stateStore.states['shelfJump'],
        false
      ),
      enterSceneDoor: new InteractiveEntity(
        'enterSceneDoor',
        'Enter room',
        'Change to main room',
        this.stateStore.states['enterDoor']
      ),
      trainingDummy: new InteractiveEntity(
        'trainingDummy',
        'Training Dummy',
        'Try some attack moves here',
        this.stateStore.states['trainingDummy'],
        false
      ),
      woodBox: new InteractiveEntity(
        'woodBox',
        'Wood Box',
        'Old Wood Box',
        this.stateStore.states['woodBox'],
        false
      ),
      zombie: new InteractiveEntity(
        'zombie',
        'Nasty Zombie',
        'What the frack is that?',
        this.stateStore.states['zombie'],
        false
      ),
      corridorDoor: new InteractiveEntity(
        'corridorDoor',
        'Corridor',
        'Change to corridor',
        this.stateStore.states['corridorDoor']
      ),
      table: new InteractiveEntity(
        'table',
        'Table',
        'Common table',
        this.stateStore.states['tableLoot']
      ),
    };

    this.usedItems = {
      upperShelf: {
        knife: 1,
        firstAid: 2,
      },
      woodBox: {
        club: 1,
      },
      table: {
        halberd: 1,
        bubbleGum: 1,
      },
    };
  }
}
