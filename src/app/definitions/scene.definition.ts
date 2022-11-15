import { InteractiveEntity } from '../entities/interactive.entity';
import { ArrayView } from './array-view.definition';

export class Scene {
  private logs: string[];

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

  public pushLog(log: string): void {
    this.logs.push(log);
  }
}
