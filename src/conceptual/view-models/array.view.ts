export class ArrayView<T> {
  private constructor(private readonly collection: T[]) {}

  public get items(): T[] {
    return [...this.collection];
  }

  public static create<T>(...collection: T[]): ArrayView<T> {
    return new ArrayView(collection);
  }

  public static fromArray<T>(collection: T[]): ArrayView<T> {
    return new ArrayView(collection);
  }

  public static empty<T>(): ArrayView<T> {
    return new ArrayView([]);
  }

  public insert(element: T): ArrayView<T> {
    return ArrayView.create(element, ...this.items);
  }

  public concat(other: ArrayView<T>): ArrayView<T> {
    return ArrayView.create(...this.items, ...other.items);
  }
}
