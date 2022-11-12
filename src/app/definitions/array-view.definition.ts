export class ArrayView<T> {
  constructor(private readonly collection: T[]) {}

  public get keyValues(): T[] {
    return [...this.collection];
  }
}
