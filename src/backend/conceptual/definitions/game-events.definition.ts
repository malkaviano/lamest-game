import { Observable } from 'rxjs';

import { SceneDefinition } from '@definitions/scene.definition';
import { ArrayView } from '@wrappers/array.view';
import { ActionableItemDefinition } from '@definitions/actionable-item.definitions';
import { LogMessageDefinition } from '@definitions/log-message.definition';
import { ReadableDefinition } from '@definitions/readable.definition';
import { PlayerInterface } from '@interfaces/player.interface';

export class GameEventsDefinition {
  constructor(
    public readonly sceneChanged$: Observable<SceneDefinition>,
    public readonly actionLogged$: Observable<LogMessageDefinition>,
    public readonly playerChanged$: Observable<PlayerInterface>,
    public readonly playerInventory$: Observable<
      ArrayView<ActionableItemDefinition>
    >,
    public readonly documentOpened$: Observable<ReadableDefinition>
  ) {}
}
