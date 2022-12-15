export class ArrayView<T> {
  private constructor(private readonly collection: T[]) {}

  public get items(): T[] {
    return [...this.collection];
  }

  public equals(other: ArrayView<T>): boolean {
    return JSON.stringify(this.items) === JSON.stringify(other.items);
  }

  public static create<T>(collection: T[]): ArrayView<T> {
    return new ArrayView(collection);
  }
}
