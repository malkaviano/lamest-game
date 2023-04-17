import { ItemUsabilityLiteral } from '../../literals/item-usability';

export interface ReadableStoreInterface {
  readonly readables: {
    readonly name: string;
    readonly label: string;
    readonly description: string;
    readonly title: string;
    readonly text: string[];
    readonly usability: ItemUsabilityLiteral;
  }[];
}
