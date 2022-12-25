import { ItemUsabilityLiteral } from '../../literals/item-usability';

export interface UsablesStoreInterface {
  readonly usables: {
    readonly name: string;
    readonly label: string;
    readonly description: string;
    readonly usability: ItemUsabilityLiteral;
  }[];
}
