import { ArrayView } from '../model-views/array.view';
import { InteractiveEntity } from './interactive.entity';
import { KeyValueInterface } from '../interfaces/key-value.interface';

export class SceneEntity {
  constructor(
    public readonly description: ArrayView<string>,
    public readonly interactives: ArrayView<InteractiveEntity>,
    public readonly transitions: KeyValueInterface<string>
  ) {}

  public reset(): void {
    this.interactives.items.forEach((i) => i.reset());
  }
}
