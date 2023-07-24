import { ReadonlyKeyValueWrapper } from '@wrappers/key-value.wrapper';
import { ConverterHelper } from '@helpers/converter.helper';

export class CooldownBehavior {
  private timer: NodeJS.Timer | null;

  private readonly onCooldown: Map<string, number>;

  constructor(private readonly intervalMilliseconds: number) {
    this.timer = null;

    this.onCooldown = new Map();
  }

  public get cooldowns(): ReadonlyKeyValueWrapper<number> {
    return ConverterHelper.mapToKeyValueInterface(this.onCooldown);
  }

  public addCooldown(key: string, durationMilliseconds: number): void {
    this.onCooldown.set(key, durationMilliseconds);

    this.startTimer();
  }

  public stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);

      this.timer = null;
    }
  }

  private startTimer() {
    if (!this.timer) {
      this.timer = setInterval(() => this.run(), this.intervalMilliseconds);
    }
  }

  private run(): void {
    const elapsed = this.intervalMilliseconds;

    for (const key in this.cooldowns) {
      const value = (this.onCooldown.get(key) ?? 0) - elapsed;

      if (value <= 0) {
        this.onCooldown.delete(key);
      } else {
        this.onCooldown.set(key, value);
      }
    }

    if (Object.keys(this.cooldowns).length === 0) {
      this.stopTimer();
    }
  }
}
