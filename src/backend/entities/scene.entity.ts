import { ArrayView } from '../../core/view-models/array.view';
import { InteractiveEntity } from './interactive.entity';
import { KeyValueInterface } from '../../core/interfaces/key-value.interface';

export class SceneEntity {
  constructor(
    public readonly description: string,
    public readonly interactives: ArrayView<InteractiveEntity>,
    public readonly transitions: KeyValueInterface<string>,
    public readonly image: string
  ) {}

  public reset(): void {
    this.interactives.items.forEach((i) => i.reset());
  }
}
