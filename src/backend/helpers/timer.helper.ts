import { ArrayView } from '../../wrappers/array.view';

export class TimerHelper {
  private static readonly mIntervals: Map<string, NodeJS.Timer> = new Map();

  public static get intervals(): ArrayView<string> {
    return ArrayView.create(...this.mIntervals.keys());
  }

  public static createInterval(
    key: string,
    f: () => void,
    interval: number
  ): void {
    this.mIntervals.set(key, setInterval(f, interval));
  }

  public static removeInterval(key: string): void {
    const timer = this.mIntervals.get(key);

    if (timer) {
      clearInterval(timer);
    }

    this.mIntervals.delete(key);
  }
}
