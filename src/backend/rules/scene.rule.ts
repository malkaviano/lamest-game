import { NarrativeService } from '../services/narrative.service';
import { ActorInterface } from '@conceptual/interfaces/actor.interface';
import { RuleExtrasInterface } from '@conceptual/interfaces/rule-extras.interface';
import { MasterRule } from './master.rule';
import { GameStringsStore } from '../../stores/game-strings.store';
import { ActionableEvent } from '@conceptual/events/actionable.event';
import { CheckedService } from '../services/checked.service';
import { RuleResultInterface } from '@conceptual/interfaces/rule-result.interface';
import { RuleNameLiteral } from '@conceptual/literals/rule-name.literal';

export class SceneRule extends MasterRule {
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
    extras: RuleExtrasInterface
  ): RuleResultInterface {
    const target = this.checkedService.getRuleTargetOrThrow(extras);

    this.narrativeService.changeScene(event);

    const logMessage = GameStringsStore.createSceneLogMessage(
      actor.name,
      target.name,
      event.actionableDefinition.label
    );

    this.ruleLog.next(logMessage);

    this.ruleResult.target = target;

    return this.getResult(event, actor, 'EXECUTED');
  }
}
