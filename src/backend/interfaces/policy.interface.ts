import { LoggerInterface } from '@interfaces/logger.interface';
import { PolicyResult } from '@results/policy.result';
import { RuleResult } from '@results/rule.result';
import { PolicyValues } from '@values/policy.values';

export interface PolicyInterface extends LoggerInterface {
  enforce(result: RuleResult, policyValues: PolicyValues): PolicyResult;
}
