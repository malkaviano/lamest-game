import { ReadonlyKeyValueWrapper } from '@wrappers/key-value.wrapper';
import { ConverterHelper } from '@helpers/converter.helper';

export class CooldownBehavior {
  private readonly timer: NodeJS.Timer;

  private readonly onCooldown: Map<string, number>;

  constructor(private readonly intervalMilliseconds: number) {
    this.timer = setInterval(() => this.run(), this.intervalMilliseconds);

    this.onCooldown = new Map();
  }

  public get cooldowns(): ReadonlyKeyValueWrapper<number> {
    return ConverterHelper.mapToKeyValueInterface(this.onCooldown);
  }

  public addCooldown(key: string, durationMilliseconds: number): void {
    this.onCooldown.set(key, durationMilliseconds);
  }

  public stop(): void {
    clearInterval(this.timer);
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
  }
}
