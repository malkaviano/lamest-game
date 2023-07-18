import { Observable } from 'rxjs';

import { ArrayView } from '@wrappers/array.view';
import { ActionableItemDefinition } from '@definitions/actionable-item.definitions';
import { LogMessageDefinition } from '@definitions/log-message.definition';
import { ReadableDefinition } from '@definitions/readable.definition';
import { PlayerInterface } from '@interfaces/player.interface';
import { SceneEntity } from '@entities/scene.entity';

export class GameEventsValues {
  constructor(
    public readonly sceneChanged$: Observable<SceneEntity>,
    public readonly actionLogged$: Observable<LogMessageDefinition>,
    public readonly playerChanged$: Observable<PlayerInterface>,
    public readonly playerInventory$: Observable<
      ArrayView<ActionableItemDefinition>
    >,
    public readonly documentOpened$: Observable<ReadableDefinition>
  ) {}
}
