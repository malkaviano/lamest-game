import { BehaviorLiteral } from '../literals/behavior.literal';

export interface EnemyStateStoreInterface {
  readonly states: {
    interactiveId: string;
    actionables: string[];
    killedState: string;
    hitpoints: number;
    attackSkillValue: number;
    weaponName: string;
    behavior: BehaviorLiteral;
  }[];
}
