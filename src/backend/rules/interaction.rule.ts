import { Injectable } from '@angular/core';

import { ActorInterface } from '../../core/interfaces/actor.interface';
import { RuleExtrasInterface } from '../../core/interfaces/rule-extras.interface';
import { CheckedHelper } from '../helpers/checked.helper';
import { MasterRuleService } from './master.rule';
import { GameStringsStore } from '../stores/game-strings.store';
import { ActionableEvent } from '../../core/events/actionable.event';

@Injectable({
  providedIn: 'root',
})
export class InteractionRule extends MasterRuleService {
  constructor(private readonly checkedHelper: CheckedHelper) {
    super();
  }

  public execute(
    actor: ActorInterface,
    action: ActionableEvent,
    extras: RuleExtrasInterface
  ): void {
    const target = this.checkedHelper.getRuleTargetOrThrow(extras);

    const { actionableDefinition } = action;

    const logMessage = GameStringsStore.createFreeLogMessage(
      'INTERACTED',
      actor.name,
      actionableDefinition.label
    );

    this.ruleLog.next(logMessage);

    const log = target.reactTo(actionableDefinition, 'NONE', {});

    if (log) {
      const logMessage = GameStringsStore.createFreeLogMessage(
        'INTERACTED',
        target.name,
        log
      );

      this.ruleLog.next(logMessage);
    }
  }
}
