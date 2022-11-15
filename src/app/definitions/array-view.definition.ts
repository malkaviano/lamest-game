export class ArrayView<T> {
  constructor(private readonly collection: T[]) {}

  public get keyValues(): T[] {
    return [...this.collection];
  }

  public equals(other: ArrayView<T>): boolean {
    return JSON.stringify(this.keyValues) === JSON.stringify(other.keyValues);
  }
}
