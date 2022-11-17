import { InteractiveEntity } from '../entities/interactive.entity';
import { ArrayView } from './array-view.definition';

export class SceneDefinition {
  constructor(
    public readonly description: ArrayView<string>,
    public readonly interactives: ArrayView<InteractiveEntity>
  ) {}
}
