import { Observable, Subject } from 'rxjs';

import { SettingsStore } from '@stores/settings.store';
import { TimerHelper } from '@helpers/timer.helper';

export class RegeneratorBehavior {
  private readonly apRegenerated: Subject<number>;

  public readonly apRegenerated$: Observable<number>;

  constructor(private readonly key: string) {
    this.apRegenerated = new Subject();

    this.apRegenerated$ = this.apRegenerated.asObservable();
  }

  public stopApRegeneration(): void {
    TimerHelper.removeInterval(this.key);
  }

  public startApRegeneration(): void {
    if (!TimerHelper.intervals.items.includes(this.key)) {
      TimerHelper.createInterval(
        this.key,
        () => this.regenerate(),
        SettingsStore.settings.actionPoints.regeneration.intervalMilliseconds
      );
    }
  }

  private regenerate(): void {
    this.apRegenerated.next(
      SettingsStore.settings.actionPoints.regeneration.amount
    );
  }
}
