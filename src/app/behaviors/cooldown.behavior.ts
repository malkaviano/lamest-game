import { Observable, Subject } from 'rxjs';

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
    if (this.mCanAct) {
      this.timeout();

      return true;
    }

    return false;
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
