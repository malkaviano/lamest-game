import { Observable, Subject } from 'rxjs';

import { SettingsStore } from '@stores/settings.store';
import { TimerHelper } from '@helpers/timer.helper';

export class RegeneratorBehavior {
  private readonly apRegenerated: Subject<number>;

  public readonly apRegenerated$: Observable<number>;

  constructor(private readonly id: string) {
    this.apRegenerated = new Subject();

    this.apRegenerated$ = this.apRegenerated.asObservable();
  }

  public stopApRegeneration(): void {
    TimerHelper.removeInterval(this.id);
  }

  public startApRegeneration(): void {
    if (!TimerHelper.intervals.items.includes(this.id)) {
      TimerHelper.createInterval(
        this.id,
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
