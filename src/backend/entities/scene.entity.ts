import { ArrayView } from '@wrappers/array.view';
import { InteractiveInterface } from '@interfaces/interactive.interface';

export class SceneEntity {
  constructor(
    public readonly name: string,
    public readonly label: string,
    public readonly interactives: ArrayView<InteractiveInterface>,
    public readonly image: string
  ) {}

  public reset(): void {
    this.interactives.items.forEach((i) => i.reset());
  }
}
