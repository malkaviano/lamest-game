import { Observable, Subject } from 'rxjs';

import { SettingsStore } from '../../stores/settings.store';

export class RegeneratorBehavior {
  private apRegenerationTimer: NodeJS.Timer | null;

  private readonly apRegenerated: Subject<number>;

  public readonly apRegenerated$: Observable<number>;

  constructor() {
    this.apRegenerationTimer = null;

    this.apRegenerated = new Subject();

    this.apRegenerated$ = this.apRegenerated.asObservable();
  }

  public stopApRegeneration(): void {
    if (this.apRegenerationTimer) {
      clearInterval(this.apRegenerationTimer);

      this.apRegenerationTimer = null;
    }
  }

  public startApRegeneration(): void {
    if (!this.apRegenerationTimer) {
      this.apRegenerationTimer = setInterval(
        () => this.regenerate(),
        SettingsStore.settings.apRegeneration.intervalMilliseconds
      );
    }
  }

  private regenerate(): void {
    this.apRegenerated.next(SettingsStore.settings.apRegeneration.amount);
  }
}
