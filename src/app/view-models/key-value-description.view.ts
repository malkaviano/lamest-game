export type KeyValueCategoryLiteral = 'identity' | 'characteristic' | 'derived-attribute' | 'skill' | 'unknown';

export class KeyValueDescriptionView {
  private constructor(
    public readonly key: string,
    public readonly value: string,
    public readonly description: string,
    public readonly category: KeyValueCategoryLiteral
  ) {}

  public static create(
    key: string,
    value: string,
    description: string,
    category: KeyValueCategoryLiteral = 'unknown'
  ): KeyValueDescriptionView {
    return new KeyValueDescriptionView(key, value, description, category);
  }
}
