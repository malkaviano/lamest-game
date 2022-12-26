export class CooldownBehavior {
  private mCanAct: boolean;

  private constructor(public readonly cooldown: number) {
    this.mCanAct = true;
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

    setTimeout(() => (this.mCanAct = true), this.cooldown);
  }

  public static create(cooldown: number) {
    return new CooldownBehavior(cooldown);
  }
}
