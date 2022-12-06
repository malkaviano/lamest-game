import { Observable } from 'rxjs';

import { SceneDefinition } from './scene.definition';
import { CharacterEntity } from '../entities/character.entity';
import { ArrayView } from '../views/array.view';
import { ActionableItemDefinition } from './actionable-item.definition';
import { LogMessageDefinition } from './log-message.definition';

export class GameEventsDefinition {
  constructor(
    public readonly sceneChanged$: Observable<SceneDefinition>,
    public readonly actionLogged$: Observable<LogMessageDefinition>,
    public readonly characterChanged$: Observable<CharacterEntity>,
    public readonly playerInventory$: Observable<
      ArrayView<ActionableItemDefinition>
    >
  ) {}
}
