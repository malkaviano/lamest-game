import { Observable } from 'rxjs';

import { SceneDefinition } from './scene.definition';
import { ArrayView } from '@wrappers/array.view';
import { ActionableItemDefinition } from './actionable-item.definitions';
import { LogMessageDefinition } from './log-message.definition';
import { ReadableInterface } from '@interfaces/readable.interface';
import { PlayerInterface } from '@interfaces/player.interface';

export class GameEventsDefinition {
  constructor(
    public readonly sceneChanged$: Observable<SceneDefinition>,
    public readonly actionLogged$: Observable<LogMessageDefinition>,
    public readonly playerChanged$: Observable<PlayerInterface>,
    public readonly playerInventory$: Observable<
      ArrayView<ActionableItemDefinition>
    >,
    public readonly documentOpened$: Observable<ReadableInterface>
  ) {}
}
