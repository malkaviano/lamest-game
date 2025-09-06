import { Observable, merge } from 'rxjs';

import { LogMessageDefinition } from '@definitions/log-message.definition';
import { LoggerInterface } from '@interfaces/logger.interface';
import { PolicyInterface } from '@interfaces/policy.interface';
import { RuleResult } from '@results/rule.result';
import { ArrayView } from '@wrappers/array.view';
import { ActionableDefinition } from '@definitions/actionable.definition';
import { InteractiveInterface } from '@interfaces/interactive.interface';
import { CombatEvent } from '@interfaces/combat-event.interface';

export class PolicyHub implements LoggerInterface {
  private readonly policies: ArrayView<PolicyInterface>;

  public readonly logMessageProduced$: Observable<LogMessageDefinition>;
  public readonly combatEventProduced$: Observable<CombatEvent>;

  constructor(..._policies: PolicyInterface[]) {
    this.policies = ArrayView.fromArray(_policies);

    this.logMessageProduced$ = merge(
      ...this.policies.items.map((p) => p.logMessageProduced$)
    );

    const combatStreams = this.policies.items
      .map((p) => p.combatEventProduced$)
      .filter((o): o is Observable<CombatEvent> => !!o);

    this.combatEventProduced$ = combatStreams.length
      ? merge(...combatStreams)
      : new Observable<CombatEvent>();
  }

  public enforcePolicies(
    ruleResult: RuleResult,
    action: ActionableDefinition,
    invisibleInteractives: ArrayView<InteractiveInterface>
  ): void {
    this.policies.items.forEach((p) =>
      p.enforce(ruleResult, { invisibleInteractives })
    );
  }
}
