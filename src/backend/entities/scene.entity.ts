import { ArrayView } from '@wrappers/array.view';
import { InteractiveInterface } from '@interfaces/interactive.interface';

export class SceneEntity {
  private readonly mInteractives: ArrayView<InteractiveInterface>;

  constructor(
    public readonly name: string,
    public readonly label: string,
    interactives: ArrayView<InteractiveInterface>,
    public readonly image: string
  ) {
    this.mInteractives = interactives;
  }

  public get interactives(): ArrayView<InteractiveInterface> {
    return this.mInteractives.filter((i) => i.actions.items.length > 0);
  }

  public reset(): void {
    this.mInteractives.items.forEach((i) => i.reset());
  }
}
