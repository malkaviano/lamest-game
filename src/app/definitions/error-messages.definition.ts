import { ErrorMessageLiteral } from '../literals/error-messages.literal';

export const errorMessages: { [key in ErrorMessageLiteral]: string } = {
  'UNKNOWN-MESSAGE': 'Unknown Message received',
  'WRONG-ACTION': 'Wrong action executed',
  'SHOULD-NOT-HAPPEN': 'Action should not happen',
};
