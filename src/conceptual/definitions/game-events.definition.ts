import { Observable } from 'rxjs';

import { SceneDefinition } from './scene.definition';
import { ArrayView } from '@wrappers/array.view';
import { ActionableItemView } from '../view-models/actionable-item.view';
import { LogMessageDefinition } from './log-message.definition';
import { ReadableInterface } from '@interfaces/readable.interface';
import { PlayerInterface } from '@interfaces/player.interface';

export class GameEventsDefinition {
  constructor(
    public readonly sceneChanged$: Observable<SceneDefinition>,
    public readonly actionLogged$: Observable<LogMessageDefinition>,
    public readonly playerChanged$: Observable<PlayerInterface>,
    public readonly playerInventory$: Observable<ArrayView<ActionableItemView>>,
    public readonly documentOpened$: Observable<ReadableInterface>
  ) {}
}
