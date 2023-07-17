export abstract class PreviousCurrentEventAbstraction<Category, Value> {
  constructor(
    public readonly category: Category,
    public readonly previous: Value,
    public readonly current: Value
  ) {}
}
