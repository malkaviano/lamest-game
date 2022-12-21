import { DocumentOpenedInterface } from './reader-dialog.interface';

export interface RuleResultInterface {
  readonly documentOpened?: DocumentOpenedInterface;
  readonly dodged?: boolean;
}
