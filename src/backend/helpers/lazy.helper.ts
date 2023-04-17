export class LazyHelper<Value> {
  private internal: Value | null;

  constructor(private readonly lazy: () => Value) {
    this.internal = null;
  }

  public get value(): Value {
    if (!this.internal) {
      this.internal = this.lazy();
    }

    return this.internal;
  }
}
