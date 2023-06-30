import { NarrativeService } from '../services/narrative.service';
import { ActorInterface } from '../../core/interfaces/actor.interface';
import { RuleExtrasInterface } from '../../core/interfaces/rule-extras.interface';
import { MasterRule } from './master.rule';
import { GameStringsStore } from '../../stores/game-strings.store';
import { ActionableEvent } from '../../core/events/actionable.event';
import { CheckedService } from '../services/checked.service';
import { RuleResultInterface } from '../../core/interfaces/rule-result.interface';

export class SceneRule extends MasterRule {
  constructor(
    private readonly narrativeService: NarrativeService,
    private readonly checkedService: CheckedService
  ) {
    super();
  }

  public override get name(): string {
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

    return { name: 'SCENE', event, actor, target, result: 'EXECUTED' };
  }
}
