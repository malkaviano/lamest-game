import { EffectTypeLiteral } from '@literals/effect-type.literal';

export interface ConsumableStoreInterface {
  readonly consumables: {
    readonly name: string;
    readonly label: string;
    readonly description: string;
    readonly hp: number;
    readonly energy: number;
    readonly effect: EffectTypeLiteral;
    readonly skillName?: string;
  }[];
}
