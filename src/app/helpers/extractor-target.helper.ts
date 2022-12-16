import { Injectable } from '@angular/core';

import { errorMessages } from '../definitions/error-messages.definition';
import { ActionReactiveInterface } from '../interfaces/action-reactive.interface';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';

@Injectable({
  providedIn: 'root',
})
export class ExtractorHelper {
  public extractRuleTarget(
    ruleExtrasInterface: RuleExtrasInterface
  ): ActionReactiveInterface {
    const target = ruleExtrasInterface.target;

    if (!target) {
      throw new Error(errorMessages['SHOULD-NOT-HAPPEN']);
    }

    return target;
  }
}
