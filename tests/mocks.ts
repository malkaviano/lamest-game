import { MatDialog } from '@angular/material/dialog';

import { of, Subject } from 'rxjs';
import { deepEqual, instance, mock, reset, when } from 'ts-mockito';

import { AffectRule } from '@rules/affect.rule';
import { ConsumeRule } from '@rules/consume.rule';
import { InteractionRule } from '@rules/interaction.rule';
import { EquipRule } from '@rules/equip.rule';
import { PickRule } from '@rules/pick.rule';
import { SceneRule } from '@rules/scene.rule';
import { SkillRule } from '@rules/skill.rule';
import { UnEquipRule } from '@rules/unequip.rule';
import { UseRule } from '@rules/use.rule';
import { CharacterService } from '@services/character.service';
import { GeneratorService } from '@services/generator.service';
import { InventoryService } from '@services/inventory.service';
import { NarrativeService } from '@services/narrative.service';
import { RandomCharacterService } from '@services/random-character.service';
import { SkillService } from '@services/skill.service';
import { ActionableState } from '@states/actionable.state';
import { ActionableStore } from '@stores/actionable.store';
import { InteractiveStore } from '@stores/interactive.store';
import { ItemStore } from '@stores/item.store';
import { MessageStore } from '@stores/message.store';
import { ResourcesStore } from '@stores/resources.store';
import { SceneStore } from '@stores/scene.store';
import { StatesStore } from '@stores/states.store';
import { GameEventsDefinition } from '@definitions/game-events.definition';
import { SceneDefinition } from '@definitions/scene.definition';
import { ArrayView } from '@wrappers/array.view';
import { ProfessionStore } from '@stores/profession.store';
import { ActorStore } from '@stores/actor.store';
import { SkillStore } from '@stores/skill.store';
import { ReadRule } from '@rules/read.rule';
import { RulesHub } from '@hubs/rules.hub';
import { ActivationAxiom } from '@axioms/activation.axiom';
import { DodgeAxiom } from '@axioms/dodge.axiom';
import { FormatterHelperService } from '../src/app/helpers/formatter.helper.service';
import { WithSubscriptionHelper } from '../src/app/helpers/with-subscription.helper';
import { RegeneratorBehavior } from '@behaviors/regenerator.behavior';
import { AiBehavior } from '@behaviors/ai.behavior';
import { PlayerEntity } from '@entities/player.entity';
import { InteractiveEntity } from '@entities/interactive.entity';
import { ActorEntity } from '@entities/actor.entity';
import { ActorBehavior } from '@behaviors/actor.behavior';
import { EquipmentBehavior } from '@behaviors/equipment.behavior';
import { SceneEntity } from '@entities/scene.entity';
import { RandomIntHelper } from '@helpers/random-int.helper';
import { CheckedService } from '@services/checked.service';
import { RollHelper } from '@helpers/roll.helper';
import { PolicyHub } from '@hubs/policy.hub';
import { GameLoopService } from '@services/game-loop.service';
import { LoggingHub } from '@hubs/logging.hub';
import { SettingsStoreInterface } from '@interfaces/stores/settings-store.interface';
import { SettingsStore } from '@stores/settings.store';

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
import { GamePredicate } from '@predicates/game.predicate';

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

export const mockedDodgeAxiom = mock(DodgeAxiom);

export const mockedRegeneratorBehavior = mock(RegeneratorBehavior);

export const mockedAiBehavior = mock(AiBehavior);

export const mockedPolicyHub = mock(PolicyHub);

export const mockedLoggingHub = mock(LoggingHub);

export const apRegeneratedSubject = new Subject<number>();

export const mockedGamePredicate = mock(GamePredicate);

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

  reset(mockedDodgeAxiom);

  reset(mockedRegeneratorBehavior);

  reset(mockedAiBehavior);

  reset(mockedPolicyHub);

  reset(mockedLoggingHub);

  reset(mockedGamePredicate);
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
