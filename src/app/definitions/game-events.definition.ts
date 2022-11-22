import { Observable } from 'rxjs';

import { SceneDefinition } from './scene.definition';
import { CharacterEntity } from '../entities/character.entity';
import { ActionableEvent } from '../events/actionable.event';
import { ArrayView } from '../views/array.view';
import { GameItemDefinition } from './game-item.definition';
import { ItemStorageDefinition } from './item-storage.definition';

export class GameEventsDefinition {
  constructor(
    public readonly sceneChanged$: Observable<SceneDefinition>,
    public readonly actionLogged$: Observable<string>,
    public readonly characterChanged$: Observable<CharacterEntity>,
    public readonly playerInventory$: Observable<
      ArrayView<ItemStorageDefinition>
    >,
    public readonly registerActionableTaken: (action: ActionableEvent) => void
  ) {}
}
