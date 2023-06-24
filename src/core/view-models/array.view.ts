export class ArrayView<T> {
  private constructor(private readonly collection: T[]) {}

  public get items(): T[] {
    return [...this.collection];
  }

  public static create<T>(collection: T[]): ArrayView<T> {
    return new ArrayView(collection);
  }

  public static empty<T>(): ArrayView<T> {
    return new ArrayView([]);
  }
}
