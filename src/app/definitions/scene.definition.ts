import { InteractiveEntity } from '../entities/interactive.entity';
import { ArrayView } from './array-view.definition';

export class SceneDefinition {
  private readonly logs: string[];

  constructor(
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
