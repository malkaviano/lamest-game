import { LoggerInterface } from '@interfaces/logger.interface';
import { PolicyResultInterface } from '@interfaces/policy-result.interface';
import { RuleResultInterface } from '@interfaces/rule-result.interface';

export interface PolicyInterface extends LoggerInterface {
  enforce(result: RuleResultInterface): PolicyResultInterface;
}
