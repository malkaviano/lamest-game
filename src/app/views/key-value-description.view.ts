export class KeyValueDescriptionView {
  private constructor(
    public readonly key: string,
    public readonly value: string,
    public readonly description: string
  ) {}

  public static create(
    key: string,
    value: string,
    description: string
  ): KeyValueDescriptionView {
    return new KeyValueDescriptionView(key, value, description);
  }
}
