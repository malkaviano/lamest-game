import { InteractiveEntity } from './interactive.entity';
import { ArrayView } from '../definitions/array-view.definition';

export class SceneEntity {
  private readonly logs: string[];

  constructor(
    public readonly id: string,
    public readonly description: ArrayView<string>,
    public readonly interactives: ArrayView<InteractiveEntity>
  ) {
    this.logs = [];
  }

  public get actionLogs(): ArrayView<string> {
    return new ArrayView(this.logs);
  }

  public addLog(log: string): void {
    this.logs.unshift(log);
  }
}
