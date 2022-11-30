import { ActionableLiteral } from '../literals/actionable.literal';

export interface ActionableStoreInterface {
  actionables: {
    name: string;
    actionable: ActionableLiteral;
    label?: string;
  }[];
}
