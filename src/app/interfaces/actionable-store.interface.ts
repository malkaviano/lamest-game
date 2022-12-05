import { ActionableLiteral } from '../literals/actionable.literal';

export interface ActionableStoreInterface {
  actionables: {
    key: string;
    name?: string;
    actionable: ActionableLiteral;
    label?: string;
  }[];
}
