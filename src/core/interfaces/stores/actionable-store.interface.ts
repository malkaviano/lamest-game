import { ActionableLiteral } from '../../literals/actionable.literal';

export interface ActionableStoreInterface {
  readonly actionables: {
    readonly key: string;
    readonly name: string;
    readonly actionable: ActionableLiteral;
    readonly label?: string;
  }[];
}
