import { Observable } from 'rxjs';

import { SceneDefinition } from './scene.definition';
import { PlayerEntity } from '../entities/player.entity';
import { ArrayView } from '../view-models/array.view';
import { ActionableItemView } from '../view-models/actionable-item.view';
import { LogMessageDefinition } from './log-message.definition';
import { ReadableInterface } from '../interfaces/readable.interface';

export class GameEventsDefinition {
  constructor(
    public readonly sceneChanged$: Observable<SceneDefinition>,
    public readonly actionLogged$: Observable<LogMessageDefinition>,
    public readonly playerChanged$: Observable<PlayerEntity>,
    public readonly playerInventory$: Observable<ArrayView<ActionableItemView>>,
    public readonly documentOpened$: Observable<ReadableInterface>,
    public readonly canActChanged$: Observable<boolean>
  ) {}
}
