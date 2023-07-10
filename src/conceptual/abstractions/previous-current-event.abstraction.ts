export abstract class PreviousCurrentEventAbstraction {
  constructor(
    public readonly previous: number,
    public readonly current: number
  ) {}

  public get effective(): number {
    return Math.abs(this.current - this.previous);
  }
}
