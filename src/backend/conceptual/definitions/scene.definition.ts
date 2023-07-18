import { InteractiveInterface } from '@interfaces/interactive.interface';
import { ArrayView } from '@wrappers/array.view';

// TODO: Review this definition
export class SceneDefinition {
  constructor(
    public readonly label: string,
    public readonly interactives: ArrayView<InteractiveInterface>,
    public readonly image: string
  ) {}
}
