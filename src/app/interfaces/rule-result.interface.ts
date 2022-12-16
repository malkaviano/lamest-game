import { LogMessageDefinition } from '../definitions/log-message.definition';
import { DocumentOpenedInterface } from './reader-dialog.interface';

export interface RuleResultInterface {
  readonly logs: LogMessageDefinition[];
  readonly documentOpened?: DocumentOpenedInterface;
  readonly dodged?: boolean;
}
