import { NarrativeService } from '@services/narrative.service';
import { ActorInterface } from '@interfaces/actor.interface';
import { RuleValues } from '@values/rule.value';
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
    extras: RuleValues
  ): RuleResult {
    const target = this.checkedService.getRuleTargetOrThrow(extras);

    this.narrativeService.changeScene(event);

    const logMessage = GameStringsStore.createSceneLogMessage(
      actor.name,
      target.name,
      this.narrativeService.currentSceneName
    );

    this.ruleLog.next(logMessage);

    this.ruleResult.target = target;

    return this.getResult(event, actor, 'EXECUTED');
  }
}
