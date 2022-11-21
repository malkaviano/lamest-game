import { Observable } from 'rxjs';

import { ActionableDefinition } from './actionable.definition';
import { SceneDefinition } from './scene.definition';
import { CharacterEntity } from '../entities/character.entity';

export class GameEventsDefinition {
  constructor(
    public readonly sceneChanged$: Observable<SceneDefinition>,
    public readonly actionLogged$: Observable<string>,
    public readonly characterChanged$: Observable<CharacterEntity>,
    public readonly registerActionableTaken: (
      action: ActionableDefinition
    ) => void
  ) {}
}
