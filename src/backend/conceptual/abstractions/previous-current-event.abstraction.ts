export abstract class PreviousCurrentEventAbstraction<Category> {
  constructor(
    public readonly category: Category,
    public readonly previous: number,
    public readonly current: number
  ) {}

  public get effective(): number {
    return Math.abs(this.current - this.previous);
  }
}
