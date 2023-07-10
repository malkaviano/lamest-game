import { LoggerInterface } from './logger.interface';
import { PolicyResultInterface } from './policy-result.interface';
import { RuleResultInterface } from './rule-result.interface';

export interface PolicyInterface extends LoggerInterface {
  enforce(result: RuleResultInterface): PolicyResultInterface;
}
