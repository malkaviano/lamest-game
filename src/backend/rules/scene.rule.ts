import { NarrativeService } from '@services/narrative.service';
import { ActorInterface } from '@interfaces/actor.interface';
import { RuleValuesDefinition } from '@definitions/rule-values.definition';
import { RuleAbstraction } from '@abstractions/rule.abstraction';
import { GameStringsStore } from '@stores/game-strings.store';
import { ActionableEvent } from '@events/actionable.event';
import { CheckedService } from '@services/checked.service';
import { RuleResult } from '@results/rule.result';
import { RuleNameLiteral } from '@literals/rule-name.literal';

export class SceneRule extends RuleAbstraction {
  constructor(
    private readonly narrativeService: NarrativeService,
    private readonly checkedService: CheckedService
  ) {
    super();
  }

  public override get name(): RuleNameLiteral {
    return 'SCENE';
  }

  public override execute(
    actor: ActorInterface,
    event: ActionableEvent,
    extras: RuleValuesDefinition
  ): RuleResult {
    const target = this.checkedService.getRuleTargetOrThrow(extras);

    this.narrativeService.changeScene(event);

    const logMessage = GameStringsStore.createSceneLogMessage(
      actor.name,
      event.actionableDefinition.label,
      target.name,
      this.narrativeService.currentSceneName
    );

    this.ruleLog.next(logMessage);

    this.ruleResult.target = target;

    return this.getResult(event, actor, 'EXECUTED');
  }
}
