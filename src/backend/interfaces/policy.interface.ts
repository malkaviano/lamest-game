import { Observable } from 'rxjs';
import { LoggerInterface } from '@interfaces/logger.interface';
import { PolicyResult } from '@results/policy.result';
import { RuleResult } from '@results/rule.result';
import { PolicyValues } from '@values/policy.values';
import { CombatEvent } from '@interfaces/combat-event.interface';

export interface PolicyInterface extends LoggerInterface {
  readonly combatEventProduced$?: Observable<CombatEvent>;
  enforce(result: RuleResult, policyValues: PolicyValues): PolicyResult;
}
