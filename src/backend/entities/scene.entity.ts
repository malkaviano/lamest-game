import { ArrayView } from '@wrappers/array.view';
import { InteractiveEntity } from '@entities/interactive.entity';
import { KeyValueInterface } from '@interfaces/key-value.interface';

export class SceneEntity {
  constructor(
    public readonly label: string,
    public readonly interactives: ArrayView<InteractiveEntity>,
    public readonly transitions: KeyValueInterface<string>,
    public readonly image: string
  ) {}

  public reset(): void {
    this.interactives.items.forEach((i) => i.reset());
  }
}
