import { LogMessageDefinition } from '../definitions/log-message.definition';

export interface RuleResultInterface {
  readonly logs: LogMessageDefinition[];
}
