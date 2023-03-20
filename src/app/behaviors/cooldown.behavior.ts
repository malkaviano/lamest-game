import { Observable, Subject } from 'rxjs';
import { GameStringsStore } from '../stores/game-strings.store';

export class CooldownBehavior {
  private mCanAct: boolean;

  private readonly canActChanged: Subject<boolean>;

  public readonly canActChanged$: Observable<boolean>;

  private constructor(public readonly cooldown: number) {
    this.mCanAct = true;

    this.canActChanged = new Subject();

    this.canActChanged$ = this.canActChanged.asObservable();
  }

  public get canAct(): boolean {
    return this.mCanAct;
  }

  public acted(): void {
    if (!this.canAct) {
      throw new Error(GameStringsStore.errorMessages['WRONG-ACTION']);
    }

    this.timeout();
  }

  private timeout() {
    this.mCanAct = false;

    this.canActChanged.next(false);

    setTimeout(() => {
      this.mCanAct = true;

      this.canActChanged.next(true);
    }, this.cooldown);
  }

  public static create(cooldown: number) {
    return new CooldownBehavior(cooldown);
  }
}
