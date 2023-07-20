import { LoggerInterface } from '@interfaces/logger.interface';
import { PolicyResult } from '@results/policy.result';
import { RuleResult } from '@results/rule.result';
import { ActionableDefinition } from '@definitions/actionable.definition';

export interface PolicyInterface extends LoggerInterface {
  enforce(result: RuleResult, action: ActionableDefinition): PolicyResult;
}
