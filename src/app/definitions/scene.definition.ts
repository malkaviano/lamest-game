import { InteractiveEntity } from '../entities/interactive.entity';
import { ArrayView } from '../model-views/array.view';

export class SceneDefinition {
  constructor(
    public readonly description: ArrayView<string>,
    public readonly interactives: ArrayView<InteractiveEntity>
  ) {}
}
