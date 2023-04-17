import { MatDialog } from '@angular/material/dialog';

import { EMPTY, of } from 'rxjs';
import { deepEqual, instance, mock, reset, when } from 'ts-mockito';

import { ActorBehavior } from '../src/backend/behaviors/actor.behavior';
import { EquipmentBehavior } from '../src/backend/behaviors/equipment.behavior';
import { ActorEntity } from '../src/backend/entities/actor.entity';
import { InteractiveEntity } from '../src/backend/entities/interactive.entity';
import { PlayerEntity } from '../src/backend/entities/player.entity';
import { SceneEntity } from '../src/backend/entities/scene.entity';
import { ConverterHelper } from '../src/backend/helpers/converter.helper';
import { CombatRule } from '../src/backend/rules/combat.rule';
import { ConsumeRule } from '../src/backend/rules/consume.rule';
import { InteractionRule } from '../src/backend/rules/interaction.rule';
import { EquipRule } from '../src/backend/rules/equip.rule';
import { PickRule } from '../src/backend/rules/pick.rule';
import { SceneRule } from '../src/backend/rules/scene.rule';
import { SkillRule } from '../src/backend/rules/skill.rule';
import { UnEquipRule } from '../src/backend/rules/unequip.rule';
import { UseRule } from '../src/backend/rules/use.rule';
import { CharacterService } from '../src/backend/services/character.service';
import { GameLoopService } from '../src/backend/services/game-loop.service';
import { GeneratorService } from '../src/backend/services/generator.service';
import { InventoryService } from '../src/backend/services/inventory.service';
import { NarrativeService } from '../src/backend/services/narrative.service';
import { RandomCharacterService } from '../src/backend/services/random-character.service';
import { RandomIntService } from '../src/backend/services/random-int.service';
import { RollService } from '../src/backend/services/roll.service';
import { SkillService } from '../src/backend/services/skill.service';
import { ActionableState } from '../src/backend/states/actionable.state';
import { ActionableStore } from '../src/backend/stores/actionable.store';
import { InteractiveStore } from '../src/backend/stores/interactive.store';
import { ItemStore } from '../src/backend/stores/item.store';
import { MessageStore } from '../src/backend/stores/message.store';
import { ResourcesStore } from '../src/backend/stores/resources.store';
import { SceneStore } from '../src/backend/stores/scene.store';
import { StatesStore } from '../src/backend/stores/states.store';
import { GameEventsDefinition } from '../src/backend/definitions/game-events.definition';
import { SceneDefinition } from '../src/backend/definitions/scene.definition';
import { ArrayView } from '../src/backend/view-models/array.view';
import { WithSubscriptionHelper } from '../src/backend/helpers/with-subscription.helper';
import { ProfessionStore } from '../src/backend/stores/profession.store';
import { ActorStore } from '../src/backend/stores/actor.store';
import { FormatterHelperService } from '../src/backend/helpers/formatter.helper.service';
import { SkillStore } from '../src/backend/stores/skill.store';
import { InspectRule } from '../src/backend/rules/inspect.rule';
import { SettingsStore } from '../src/backend/stores/settings.store';
import { CheckedHelper } from '../src/backend/helpers/checked.helper';
import { RuleDispatcherService } from '../src/backend/services/rule-dispatcher.service';
import { ActivationAxiomService } from '../src/backend/axioms/activation.axiom.service';
import { AffectAxiomService } from '../src/backend/axioms/affect.axiom.service';

import {
  actorInfo,
  fakeCharacteristics,
  fakeCharacterSheet,
  fakeDerivedAttributes,
  fakeIdentity,
  fakeSkills,
  fakeSkillStore,
  gameSettings,
  interactiveInfo,
  playerInfo,
  simpleSword,
} from './fakes';
import { DodgeAxiomService } from '../src/backend/axioms/dodge.axiom.service';
import { EventHubHelperService } from '../src/backend/helpers/event-hub.helper.service';
import { ReadAxiomService } from '../src/backend/axioms/read.axiom.service';
import { CooldownBehavior } from '../src/backend/behaviors/cooldown.behavior';
import { AiBehavior } from '../src/backend/behaviors/ai.behavior';

export const mockedInventoryService = mock(InventoryService);

export const mockedPlayerEntity = mock(PlayerEntity);

export const mockedTargetPlayerEntity = mock(PlayerEntity);

export const mockedInteractiveEntity = mock(InteractiveEntity);

export const mockedRollService = mock(RollService);

export const mockedNarrativeService = mock(NarrativeService);

export const mockedItemStore = mock(ItemStore);

export const mockedGameLoopService = mock(GameLoopService);

export const mockedCharacterService = mock(CharacterService);

export const mockedActorEntity = mock(ActorEntity);

export const mockedActorEntity2 = mock(ActorEntity);

export const mockedActorBehavior = mock(ActorBehavior);

export const mockedEquipmentBehavior = mock(EquipmentBehavior);

export const mockedConverterHelper = mock(ConverterHelper);

export const mockedResourcesStore = mock(ResourcesStore);

export const mockedStatesStore = mock(StatesStore);

export const mockedSkillRule = mock(SkillRule);

export const mockedPickRule = mock(PickRule);

export const mockedEquipRule = mock(EquipRule);

export const mockedUnEquipRule = mock(UnEquipRule);

export const mockedSceneRule = mock(SceneRule);

export const mockedConsumeRule = mock(ConsumeRule);

export const mockedInteractionRule = mock(InteractionRule);

export const mockedCombatRule = mock(CombatRule);

export const mockedRuleDispatcherService = mock(RuleDispatcherService);

export const mockedSceneStore = mock(SceneStore);

export const mockedInteractiveStore = mock(InteractiveStore);

export const mockedActionableState = mock<ActionableState>();

export const mockedActionableState2 = mock<ActionableState>();

export const mockedMessageStore = mock(MessageStore);

export const mockedActionableStore = mock(ActionableStore);

export const mockedRandomCharacterService = mock(RandomCharacterService);

export const mockedRandomIntService = mock(RandomIntService);

export const mockedGeneratorService = mock(GeneratorService);

export const mockedSkillService = mock(SkillService);

export const mockedSceneEntity = mock(SceneEntity);

export const mockedUseRule = mock(UseRule);

export const mockedGameEventsService = mock(GameEventsDefinition);

export const mockedWithSubscriptionHelper = mock(WithSubscriptionHelper);

export const mockedProfessionStore = mock(ProfessionStore);

export const mockedActorStore = mock(ActorStore);

export const mockedFormatterHelperService = mock(FormatterHelperService);

export const mockedSkillStore = mock(SkillStore);

export const mockedMatDialog = mock(MatDialog);

export const mockedInspectRule = mock(InspectRule);

export const mockedSettingsStore = mock(SettingsStore);

export const mockedCheckedHelper = mock(CheckedHelper);

export const mockedActivationAxiomService = mock(ActivationAxiomService);

export const mockedAffectedAxiomService = mock(AffectAxiomService);

export const mockedDodgeAxiomService = mock(DodgeAxiomService);

export const mockedEventHubHelperService = mock(EventHubHelperService);

export const mockedReadAxiomService = mock(ReadAxiomService);

export const mockedCooldownBehavior = mock(CooldownBehavior);

export const mockedAiBehavior = mock(AiBehavior);

export const setupMocks = () => {
  resetMocks();

  when(mockedCharacterService.currentCharacter).thenReturn(
    instance(mockedPlayerEntity)
  );

  when(mockedCharacterService.randomCharacter).thenReturn(
    instance(mockedPlayerEntity)
  );

  when(mockedPlayerEntity.id).thenReturn(playerInfo.id);

  when(mockedPlayerEntity.name).thenReturn(playerInfo.name);

  when(mockedPlayerEntity.classification).thenReturn('PLAYER');

  when(mockedPlayerEntity.skills).thenReturn(fakeSkills);

  when(mockedPlayerEntity.identity).thenReturn(fakeIdentity);

  when(mockedInteractiveEntity.id).thenReturn(interactiveInfo.id);

  when(mockedInteractiveEntity.name).thenReturn(interactiveInfo.name);

  when(mockedInteractiveEntity.classification).thenReturn('REACTIVE');

  when(mockedActorEntity.id).thenReturn(actorInfo.id);

  when(mockedActorEntity.name).thenReturn(actorInfo.name);

  when(mockedActorEntity.skills).thenReturn(fakeSkills);

  when(mockedActorEntity.derivedAttributes).thenReturn(fakeDerivedAttributes);

  when(mockedActorEntity.classification).thenReturn('ACTOR');

  when(mockedActorEntity.situation).thenReturn('ALIVE');

  when(mockedActorEntity2.id).thenReturn(`${actorInfo.id}2`);

  when(mockedActorEntity2.name).thenReturn(`${actorInfo.name}2`);

  when(mockedActorEntity2.skills).thenReturn(fakeSkills);

  when(mockedActorEntity2.classification).thenReturn('ACTOR');

  when(mockedActorEntity2.situation).thenReturn('ALIVE');

  when(mockedTargetPlayerEntity.name).thenReturn('targetPlayer');

  when(mockedTargetPlayerEntity.classification).thenReturn('PLAYER');

  when(mockedTargetPlayerEntity.situation).thenReturn('ALIVE');

  when(mockedPlayerEntity.situation).thenReturn('ALIVE');

  when(mockedPlayerEntity.visibility).thenReturn('VISIBLE');

  when(mockedActorEntity.visibility).thenReturn('VISIBLE');

  when(mockedActorEntity2.visibility).thenReturn('VISIBLE');

  when(mockedPlayerEntity.characteristics).thenReturn(fakeCharacteristics);

  when(mockedPlayerEntity.derivedAttributes).thenReturn(fakeDerivedAttributes);

  when(mockedPlayerEntity.skills).thenReturn(fakeSkills);

  const instanceActorEntity = instance(mockedActorEntity);

  const instanceActorEntity2 = instance(mockedActorEntity2);

  const instancePlayerEntity = instance(mockedPlayerEntity);

  Object.setPrototypeOf(instanceActorEntity, ActorEntity.prototype);

  Object.setPrototypeOf(instanceActorEntity2, ActorEntity.prototype);

  Object.setPrototypeOf(instancePlayerEntity, ActorEntity.prototype);

  Object.setPrototypeOf(
    instance(mockedTargetPlayerEntity),
    ActorEntity.prototype
  );

  when(mockedActorBehavior.characteristics).thenReturn(fakeCharacteristics);

  when(mockedActorBehavior.skills).thenReturn(fakeSkills);

  when(mockedActorBehavior.derivedAttributes).thenReturn(fakeDerivedAttributes);

  when(mockedActorBehavior.situation).thenReturn('ALIVE');

  when(mockedEquipmentBehavior.equip(simpleSword)).thenReturn(null);

  when(mockedResourcesStore.weaponStore).thenReturn({
    weapons: [],
  });

  when(mockedResourcesStore.consumableStore).thenReturn({
    consumables: [],
  });

  when(mockedResourcesStore.usablesStore).thenReturn({
    usables: [],
  });

  when(mockedResourcesStore.skillStateStore).thenReturn({
    states: [],
  });

  when(mockedResourcesStore.visibilityStateStore).thenReturn({
    states: [],
  });

  when(mockedResourcesStore.destroyableStateStore).thenReturn({
    states: [],
  });

  when(mockedResourcesStore.discardStateStore).thenReturn({
    states: [],
  });

  when(mockedResourcesStore.conversationStateStore).thenReturn({
    states: [],
  });

  when(mockedResourcesStore.lockedContainerStateStore).thenReturn({
    states: [],
  });

  when(mockedResourcesStore.professionStore).thenReturn({
    professions: [],
  });

  when(mockedResourcesStore.readableStore).thenReturn({
    readables: [],
  });

  when(mockedResourcesStore.settingsStore).thenReturn({
    settings: {
      intelligencePoints: 10,
      professionPoints: 300,
      vulnerabilityCoefficient: 1.5,
      resistanceCoefficient: 0.5,
      oneDodgesEveryAgiAmount: 8,
      playerEffectDefenses: {
        cures: ArrayView.create([]),
        immunities: ArrayView.create([]),
        resistances: ArrayView.create([]),
        vulnerabilities: ArrayView.create([]),
      },
      actionCooldown: 0,
    },
  });

  when(mockedGeneratorService.identity()).thenReturn(fakeIdentity);

  when(mockedGeneratorService.characteristics()).thenReturn(
    fakeCharacteristics
  );

  when(mockedGameLoopService.events).thenReturn(
    instance(mockedGameEventsService)
  );

  when(mockedGameEventsService.playerChanged$).thenReturn(
    of(instance(mockedPlayerEntity))
  );

  when(mockedGameEventsService.sceneChanged$).thenReturn(
    of(
      new SceneDefinition(
        'this is a test',
        ArrayView.create([instance(mockedInteractiveEntity)]),
        'gg.jpg'
      )
    )
  );

  when(mockedGameEventsService.documentOpened$).thenReturn(of());

  when(
    mockedFormatterHelperService.characterToKeyValueDescription(
      instance(mockedPlayerEntity)
    )
  ).thenReturn(fakeCharacterSheet);

  when(mockedSkillStore.skills).thenReturn(fakeSkillStore);

  when(mockedSettingsStore.settings).thenReturn(gameSettings);

  when(mockedAffectedAxiomService.logMessageProduced$).thenReturn(EMPTY);

  when(mockedCooldownBehavior.canAct).thenReturn(true);

  mockCheckedHelper();
};

const resetMocks = () => {
  reset(mockedInventoryService);

  reset(mockedPlayerEntity);

  reset(mockedInteractiveEntity);

  reset(mockedRollService);

  reset(mockedNarrativeService);

  reset(mockedGameLoopService);

  reset(mockedCharacterService);

  reset(mockedActorEntity);

  reset(mockedTargetPlayerEntity);

  reset(mockedActorBehavior);

  reset(mockedEquipmentBehavior);

  reset(mockedConverterHelper);

  reset(mockedResourcesStore);

  reset(mockedStatesStore);

  reset(mockedSkillRule);

  reset(mockedPickRule);

  reset(mockedEquipRule);

  reset(mockedUnEquipRule);

  reset(mockedSceneRule);

  reset(mockedConsumeRule);

  reset(mockedInteractionRule);

  reset(mockedCombatRule);

  reset(mockedRuleDispatcherService);

  reset(mockedSceneStore);

  reset(mockedRandomIntService);

  reset(mockedActionableState);

  reset(mockedActionableState2);

  reset(mockedMessageStore);

  reset(mockedRandomCharacterService);

  reset(mockedSceneEntity);

  reset(mockedUseRule);

  reset(mockedGameEventsService);

  reset(mockedWithSubscriptionHelper);

  reset(mockedProfessionStore);

  reset(mockedActorStore);

  reset(mockedFormatterHelperService);

  reset(mockedSkillStore);

  reset(mockedMatDialog);

  reset(mockedInspectRule);

  reset(mockedSettingsStore);

  reset(mockedActorEntity2);

  reset(mockedCheckedHelper);

  reset(mockedActivationAxiomService);

  reset(mockedAffectedAxiomService);

  reset(mockedDodgeAxiomService);

  reset(mockedEventHubHelperService);

  reset(mockedReadAxiomService);

  reset(mockedCooldownBehavior);

  reset(mockedAiBehavior);
};

function mockCheckedHelper() {
  when(
    mockedCheckedHelper.getRuleTargetOrThrow(
      deepEqual({
        target: instance(mockedInteractiveEntity),
      })
    )
  ).thenReturn(instance(mockedInteractiveEntity));

  when(
    mockedCheckedHelper.getRuleTargetOrThrow(
      deepEqual({
        target: instance(mockedInteractiveEntity),
        actorVisibility: instance(mockedPlayerEntity),
      })
    )
  ).thenReturn(instance(mockedInteractiveEntity));

  when(
    mockedCheckedHelper.getRuleTargetOrThrow(
      deepEqual({
        target: instance(mockedActorEntity),
      })
    )
  ).thenReturn(instance(mockedActorEntity));

  when(
    mockedCheckedHelper.getRuleTargetOrThrow(
      deepEqual({
        target: instance(mockedPlayerEntity),
      })
    )
  ).thenReturn(instance(mockedPlayerEntity));

  when(
    mockedCheckedHelper.getRuleTargetOrThrow(
      deepEqual({
        target: instance(mockedTargetPlayerEntity),
      })
    )
  ).thenReturn(instance(mockedTargetPlayerEntity));

  when(
    mockedCheckedHelper.getRuleTargetOrThrow(
      deepEqual({
        target: instance(mockedPlayerEntity),
        targetDodgesPerformed: 2,
      })
    )
  ).thenReturn(instance(mockedPlayerEntity));
}
