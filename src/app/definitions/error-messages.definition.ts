import { ErrorMessageLiteral } from '../literals/error-messages.literal';

export const errorMessages: { [key in ErrorMessageLiteral]: string } = {
  'INVALID-OPERATION': 'Invalid operation ocurred',
  'WRONG-ACTION': 'Wrong action executed',
  'SHOULD-NOT-HAPPEN': 'Action should not happen',
  'WRONG-ITEM': 'Wrong item was used',
};
