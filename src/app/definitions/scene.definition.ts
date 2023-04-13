import { InteractiveEntity } from '../entities/interactive.entity';
import { ArrayView } from '../view-models/array.view';

export class SceneDefinition {
  constructor(
    public readonly description: ArrayView<string>,
    public readonly interactives: ArrayView<InteractiveEntity>
  ) {}
}
