import { InteractiveInterface } from '@interfaces/interactive.interface';
import { ArrayView } from '../view-models/array.view';

export class SceneDefinition {
  constructor(
    public readonly description: string,
    public readonly interactives: ArrayView<InteractiveInterface>,
    public readonly image: string
  ) {}
}
