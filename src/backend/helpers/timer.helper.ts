import { ArrayView } from '../../wrappers/array.view';

export class TimerHelper {
  private readonly mIntervals: Map<string, NodeJS.Timer>;

  constructor() {
    this.mIntervals = new Map();
  }

  public get intervals(): ArrayView<string> {
    return ArrayView.create(...this.mIntervals.keys());
  }

  public createInterval(id: string, f: () => void, interval: number): void {
    this.mIntervals.set(id, setInterval(f, interval));
  }

  public removeInterval(id: string): void {
    const timer = this.mIntervals.get(id);

    if (timer) {
      clearInterval(timer);
    }

    this.mIntervals.delete(id);
  }
}
