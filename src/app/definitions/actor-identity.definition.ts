import { VisibilityLiteral } from '../literals/visibility.literal';

export class ActorIdentityDefinition {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly visibility: VisibilityLiteral
  ) {}
}
