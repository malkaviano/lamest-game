import { VisibilityLiteral } from '@literals/visibility.literal';

export interface InteractiveStoreInterface {
  readonly interactives: {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly state: string;
    readonly resettable: boolean;
    readonly visibility: VisibilityLiteral;
  }[];
}
