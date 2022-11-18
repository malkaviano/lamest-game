export class ArrayView<T> {
  constructor(private readonly collection: T[]) {}

  public get items(): T[] {
    return [...this.collection];
  }

  public equals(other: ArrayView<T>): boolean {
    return JSON.stringify(this.items) === JSON.stringify(other.items);
  }
}
