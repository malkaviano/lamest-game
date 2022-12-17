import { Injectable } from '@angular/core';

import { ActionableEvent } from '../events/actionable.event';
import { RuleInterface } from '../interfaces/rule.interface';
import { RuleResultInterface } from '../interfaces/rule-result.interface';
import {
  createFreeLogMessage,
  LogMessageDefinition,
} from '../definitions/log-message.definition';
import { ActorInterface } from '../interfaces/actor.interface';
import { RuleExtrasInterface } from '../interfaces/rule-extras.interface';
import { ExtractorHelper } from '../helpers/extractor.helper';

@Injectable({
  providedIn: 'root',
})
export class InteractionRule implements RuleInterface {
  constructor(private readonly extractorHelper: ExtractorHelper) {}

  public execute(
    actor: ActorInterface,
    action: ActionableEvent,
    extras: RuleExtrasInterface
  ): RuleResultInterface {
    const target = this.extractorHelper.extractRuleTargetOrThrow(extras);

    const logs: LogMessageDefinition[] = [];

    const { actionableDefinition } = action;

    const log = target.reactTo(actionableDefinition, 'NONE', {});

    logs.push(createFreeLogMessage(actor.name, actionableDefinition.label));

    if (log) {
      logs.push(createFreeLogMessage(target.name, log));
    }

    return { logs };
  }
}
