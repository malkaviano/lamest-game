import { ReadonlyKeyValueWrapper } from '@wrappers/key-value.wrapper';
import { ConverterHelper } from '@helpers/converter.helper';
import { TimerHelper } from '@helpers/timer.helper';

export class CooldownBehavior {
  private readonly onCooldown: Map<string, number>;

  constructor(
    private readonly id: string,
    private readonly intervalMilliseconds: number
  ) {
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
    TimerHelper.removeInterval(this.id);
  }

  private startTimer() {
    if (!this.exists()) {
      TimerHelper.createInterval(
        this.id,
        () => this.run(),
        this.intervalMilliseconds
      );
    }
  }

  private run(): void {
    const elapsed = this.intervalMilliseconds;

    console.log(elapsed);
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

  private exists() {
    return TimerHelper.intervals.items.includes(this.id);
  }
}
