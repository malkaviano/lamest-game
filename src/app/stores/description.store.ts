import { Injectable } from '@angular/core';

import { KeyValueInterface } from '../interfaces/key-value.interface';
import { ArrayView } from '../views/array.view';

@Injectable({
  providedIn: 'root',
})
export class DescriptionStore {
  public readonly descriptions: KeyValueInterface<ArrayView<string>>;

  constructor() {
    this.descriptions = {
      scene1: new ArrayView([
        `The main room, it's a medium size room with white walls`,
        `You see the yard door behind you`,
        `There's an elevated shelf on the left wall, maybe you can reach it if you put some effort`,
        `In front of you, another door leads probably to the rest of the building`,
        `To the right, an old wood box, there's no way to know what's inside`,
      ]),
      scene2: new ArrayView([
        'This is the outside yard',
        `There's only garden around you and the door leading back to the room`,
        `The training dummy is acting strange, either destroy it or leave`,
      ]),
      scene3: new ArrayView([
        'A corridor presents itself before you',
        `It appears that a door exists in the end, there's not too much light`,
        `A sound catches your attention, some nasty creature is staring you`,
        `Behind you the door to main room`,
        `GOOD LUCK!`,
      ]),
    };
  }
}
