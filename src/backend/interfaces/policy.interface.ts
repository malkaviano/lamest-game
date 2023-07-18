import { LoggerInterface } from '@interfaces/logger.interface';
import { PolicyResult } from '@results/policy.result';
import { RuleResult } from '@results/rule.result';

export interface PolicyInterface extends LoggerInterface {
  enforce(result: RuleResult): PolicyResult;
}
