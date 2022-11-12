import { DerivedAttribute } from './attribute.definition';

export class DerivedAttributes {
  constructor(
    public readonly hp: DerivedAttribute,
    public readonly pp: DerivedAttribute,
    public readonly mov: DerivedAttribute
  ) {}
}
