import { InteractiveEntity } from './interactive.entity';
import { ArrayView } from '../definitions/array-view.definition';

export class SceneEntity {
  private readonly logs: string[];

  constructor(
    public readonly id: string,
    public readonly paragraphs: string[],
    public readonly interactives: InteractiveEntity[]
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
