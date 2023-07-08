import { MatDialog } from '@angular/material/dialog';

import { EMPTY, of, Subject } from 'rxjs';
import { deepEqual, instance, mock, reset, when } from 'ts-mockito';

import { AffectRule } from '../src/backend/rules/affect.rule';
import { ConsumeRule } from '../src/backend/rules/consume.rule';
import { InteractionRule } from '../src/backend/rules/interaction.rule';
import { EquipRule } from '../src/backend/rules/equip.rule';
import { PickRule } from '../src/backend/rules/pick.rule';
import { SceneRule } from '../src/backend/rules/scene.rule';
import { SkillRule } from '../src/backend/rules/skill.rule';
import { UnEquipRule } from '../src/backend/rules/unequip.rule';
import { UseRule } from '../src/backend/rules/use.rule';
import { CharacterService } from '../src/backend/services/character.service';
import { GeneratorService } from '../src/backend/services/generator.service';
import { InventoryService } from '../src/backend/services/inventory.service';
import { NarrativeService } from '../src/backend/services/narrative.service';
import { RandomCharacterService } from '../src/backend/services/random-character.service';
import { SkillService } from '../src/backend/services/skill.service';
import { ActionableState } from '../src/core/states/actionable.state';
import { ActionableStore } from '../src/stores/actionable.store';
import { InteractiveStore } from '../src/stores/interactive.store';
import { ItemStore } from '../src/stores/item.store';
import { MessageStore } from '../src/stores/message.store';
import { ResourcesStore } from '../src/stores/resources.store';
import { SceneStore } from '../src/stores/scene.store';
import { StatesStore } from '../src/stores/states.store';
import { GameEventsDefinition } from '../src/core/definitions/game-events.definition';
import { SceneDefinition } from '../src/core/definitions/scene.definition';
import { ArrayView } from '../src/core/view-models/array.view';
import { ProfessionStore } from '../src/stores/profession.store';
import { ActorStore } from '../src/stores/actor.store';
import { SkillStore } from '../src/stores/skill.store';
import { ReadRule } from '../src/backend/rules/read.rule';
import { RulesHub } from '../src/backend/hubs/rules.hub';
import { ActivationAxiom } from '../src/core/axioms/activation.axiom';
import { AffectAxiom } from '../src/core/axioms/affect.axiom';
import { DodgeAxiom } from '../src/core/axioms/dodge.axiom';
import { FormatterHelperService } from '../src/app/helpers/formatter.helper.service';
import { WithSubscriptionHelper } from '../src/app/helpers/with-subscription.helper';
import { RegeneratorBehavior } from '../src/core/behaviors/regenerator.behavior';
import { AiBehavior } from '../src/core/behaviors/ai.behavior';
import { PlayerEntity } from '../src/core/entities/player.entity';
import { InteractiveEntity } from '../src/core/entities/interactive.entity';
import { ActorEntity } from '../src/core/entities/actor.entity';
import { ActorBehavior } from '../src/core/behaviors/actor.behavior';
import { EquipmentBehavior } from '../src/core/behaviors/equipment.behavior';
import { SceneEntity } from '../src/core/entities/scene.entity';
import { RandomIntHelper } from '../src/core/helpers/random-int.helper';
import { CheckedService } from '../src/backend/services/checked.service';
import { RollHelper } from '../src/core/helpers/roll.helper';
import { PolicyHub } from '../src/backend/hubs/policy.hub';
import { GameLoopService } from '../src/backend/services/game-loop.service';
import { LoggingHub } from '../src/backend/hubs/logging.hub';
import { SettingsStoreInterface } from '../src/core/interfaces/stores/settings-store.interface';
import { SettingsStore } from '../src/stores/settings.store';

import settingsStore from './settings.json';

import {
  actorInfo,
  fakeCharacteristics,
  fakeCharacterSheet,
  fakeDerivedAttributes,
  fakeIdentity,
  fakeSkills,
  fakeSkillStore,
  interactiveInfo,
  playerInfo,
  simpleSword,
} from './fakes';

export const mockedInventoryService = mock(InventoryService);

export const mockedPlayerEntity = mock(PlayerEntity);

export const mockedTargetPlayerEntity = mock(PlayerEntity);

export const mockedInteractiveEntity = mock(InteractiveEntity);

export const mockedRollHelper = mock(RollHelper);

export const mockedNarrativeService = mock(NarrativeService);

export const mockedItemStore = mock(ItemStore);

export const mockedGameLoopService = mock(GameLoopService);

export const mockedCharacterService = mock(CharacterService);

export const mockedActorEntity = mock(ActorEntity);

export const mockedActorEntity2 = mock(ActorEntity);

export const mockedActorBehavior = mock(ActorBehavior);

export const mockedEquipmentBehavior = mock(EquipmentBehavior);

export const mockedResourcesStore = mock(ResourcesStore);

export const mockedStatesStore = mock(StatesStore);

export const mockedSkillRule = mock(SkillRule);

export const mockedPickRule = mock(PickRule);

export const mockedEquipRule = mock(EquipRule);

export const mockedUnEquipRule = mock(UnEquipRule);

export const mockedSceneRule = mock(SceneRule);

export const mockedConsumeRule = mock(ConsumeRule);

export const mockedInteractionRule = mock(InteractionRule);

export const mockedAffectRule = mock(AffectRule);

export const mockedRulesHub = mock(RulesHub);

export const mockedSceneStore = mock(SceneStore);

export const mockedInteractiveStore = mock(InteractiveStore);

export const mockedActionableState = mock<ActionableState>();

export const mockedActionableState2 = mock<ActionableState>();

export const mockedMessageStore = mock(MessageStore);

export const mockedActionableStore = mock(ActionableStore);

export const mockedRandomCharacterService = mock(RandomCharacterService);

export const mockedRandomIntHelper = mock(RandomIntHelper);

export const mockedGeneratorService = mock(GeneratorService);

export const mockedSkillService = mock(SkillService);

export const mockedSceneEntity = mock(SceneEntity);

export const mockedUseRule = mock(UseRule);

export const mockedGameEventsDefinition = mock(GameEventsDefinition);

export const mockedWithSubscriptionHelper = mock(WithSubscriptionHelper);

export const mockedProfessionStore = mock(ProfessionStore);

export const mockedActorStore = mock(ActorStore);

export const mockedFormatterHelperService = mock(FormatterHelperService);

export const mockedSkillStore = mock(SkillStore);

export const mockedMatDialog = mock(MatDialog);

export const mockedReadRule = mock(ReadRule);

export const mockedCheckedService = mock(CheckedService);

export const mockedActivationAxiom = mock(ActivationAxiom);

export const mockedAffectedAxiom = mock(AffectAxiom);

export const mockedDodgeAxiom = mock(DodgeAxiom);

export const mockedRegeneratorBehavior = mock(RegeneratorBehavior);

export const mockedAiBehavior = mock(AiBehavior);

export const mockedPolicyHub = mock(PolicyHub);

export const mockedLoggingHub = mock(LoggingHub);

export const apRegeneratedSubject = new Subject<number>();

export const setupMocks = () => {
  resetMocks();

  when(mockedRegeneratorBehavior.apRegenerated$).thenReturn(
    apRegeneratedSubject.asObservable()
  );

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

  when(mockedActorEntity2.derivedAttributes).thenReturn(fakeDerivedAttributes);

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

  when(mockedAiBehavior.aiBehavior).thenReturn('AGGRESSIVE');

  when(mockedAiBehavior.ignores).thenReturn(ArrayView.create('DISGUISED'));

  const instanceActorEntity = instance(mockedActorEntity);

  const instanceActorEntity2 = instance(mockedActorEntity2);

  const instancePlayerEntity = instance(mockedPlayerEntity);

  Object.setPrototypeOf(instanceActorEntity, ActorEntity.prototype);

  Object.setPrototypeOf(instanceActorEntity2, ActorEntity.prototype);

  Object.setPrototypeOf(instancePlayerEntity, PlayerEntity.prototype);

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

  when(mockedGeneratorService.identity()).thenReturn(fakeIdentity);

  when(mockedGeneratorService.characteristics()).thenReturn(
    fakeCharacteristics
  );

  when(mockedGameLoopService.events).thenReturn(
    instance(mockedGameEventsDefinition)
  );

  when(mockedGameEventsDefinition.playerChanged$).thenReturn(
    of(instance(mockedPlayerEntity))
  );

  when(mockedGameEventsDefinition.sceneChanged$).thenReturn(
    of(
      new SceneDefinition(
        'this is a test',
        ArrayView.create(instance(mockedInteractiveEntity)),
        'gg.jpg'
      )
    )
  );

  when(mockedGameEventsDefinition.documentOpened$).thenReturn(of());

  when(
    mockedFormatterHelperService.characterToKeyValueDescription(
      instance(mockedPlayerEntity)
    )
  ).thenReturn(fakeCharacterSheet);

  when(mockedSkillStore.skills).thenReturn(fakeSkillStore);

  when(mockedAffectedAxiom.logMessageProduced$).thenReturn(EMPTY);

  when(mockedAffectRule.name).thenReturn('AFFECT');

  mockCheckedHelper();
};

const resetMocks = () => {
  reset(mockedInventoryService);

  reset(mockedPlayerEntity);

  reset(mockedInteractiveEntity);

  reset(mockedRollHelper);

  reset(mockedNarrativeService);

  reset(mockedGameLoopService);

  reset(mockedCharacterService);

  reset(mockedActorEntity);

  reset(mockedTargetPlayerEntity);

  reset(mockedActorBehavior);

  reset(mockedEquipmentBehavior);

  reset(mockedResourcesStore);

  reset(mockedStatesStore);

  reset(mockedSkillRule);

  reset(mockedPickRule);

  reset(mockedEquipRule);

  reset(mockedUnEquipRule);

  reset(mockedSceneRule);

  reset(mockedConsumeRule);

  reset(mockedInteractionRule);

  reset(mockedAffectRule);

  reset(mockedRulesHub);

  reset(mockedSceneStore);

  reset(mockedRandomIntHelper);

  reset(mockedActionableState);

  reset(mockedActionableState2);

  reset(mockedMessageStore);

  reset(mockedRandomCharacterService);

  reset(mockedSceneEntity);

  reset(mockedUseRule);

  reset(mockedGameEventsDefinition);

  reset(mockedWithSubscriptionHelper);

  reset(mockedProfessionStore);

  reset(mockedActorStore);

  reset(mockedFormatterHelperService);

  reset(mockedSkillStore);

  reset(mockedMatDialog);

  reset(mockedReadRule);

  reset(mockedActorEntity2);

  reset(mockedCheckedService);

  reset(mockedActivationAxiom);

  reset(mockedAffectedAxiom);

  reset(mockedDodgeAxiom);

  reset(mockedRegeneratorBehavior);

  reset(mockedAiBehavior);

  reset(mockedPolicyHub);

  reset(mockedLoggingHub);
};

function mockCheckedHelper() {
  when(
    mockedCheckedService.getRuleTargetOrThrow(
      deepEqual({
        target: instance(mockedInteractiveEntity),
      })
    )
  ).thenReturn(instance(mockedInteractiveEntity));

  when(
    mockedCheckedService.getRuleTargetOrThrow(
      deepEqual({
        target: instance(mockedInteractiveEntity),
        actorVisibility: instance(mockedPlayerEntity),
      })
    )
  ).thenReturn(instance(mockedInteractiveEntity));

  when(
    mockedCheckedService.getRuleTargetOrThrow(
      deepEqual({
        target: instance(mockedActorEntity),
      })
    )
  ).thenReturn(instance(mockedActorEntity));

  when(
    mockedCheckedService.getRuleTargetOrThrow(
      deepEqual({
        target: instance(mockedPlayerEntity),
      })
    )
  ).thenReturn(instance(mockedPlayerEntity));

  when(
    mockedCheckedService.getRuleTargetOrThrow(
      deepEqual({
        target: instance(mockedTargetPlayerEntity),
      })
    )
  ).thenReturn(instance(mockedTargetPlayerEntity));

  when(
    mockedCheckedService.getRuleTargetOrThrow(
      deepEqual({
        target: instance(mockedPlayerEntity),
        targetDodgesPerformed: 2,
      })
    )
  ).thenReturn(instance(mockedPlayerEntity));
}

SettingsStore.initialize(settingsStore as SettingsStoreInterface);
