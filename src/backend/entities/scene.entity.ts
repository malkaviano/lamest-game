import { ArrayView } from '@wrappers/array.view';
import { InteractiveEntity } from '@entities/interactive.entity';

export class SceneEntity {
  constructor(
    public readonly name: string,
    public readonly label: string,
    public readonly interactives: ArrayView<InteractiveEntity>,
    public readonly image: string
  ) {}

  public reset(): void {
    this.interactives.items.forEach((i) => i.reset());
  }
}
