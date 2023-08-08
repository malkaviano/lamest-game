import { ArrayView } from '../../wrappers/array.view';

export class TimerHelper {
  private static readonly mIntervals: Map<string, NodeJS.Timer> = new Map();

  public static get intervals(): ArrayView<string> {
    return ArrayView.create(...this.mIntervals.keys());
  }

  public static createInterval(
    id: string,
    f: () => void,
    interval: number
  ): void {
    this.mIntervals.set(id, setInterval(f, interval));
  }

  public static removeInterval(id: string): void {
    const timer = this.mIntervals.get(id);

    if (timer) {
      clearInterval(timer);
    }

    this.mIntervals.delete(id);
  }
}
