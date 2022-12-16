import { MatDialog } from '@angular/material/dialog';

import { of } from 'rxjs';
import { instance, mock, reset, when } from 'ts-mockito';

import { ActorBehavior } from '../src/app/behaviors/actor.behavior';
import { EquipmentBehavior } from '../src/app/behaviors/equipment.behavior';
import { ActorEntity } from '../src/app/entities/actor.entity';
import { InteractiveEntity } from '../src/app/entities/interactive.entity';
import { PlayerEntity } from '../src/app/entities/player.entity';
import { SceneEntity } from '../src/app/entities/scene.entity';
import { ConverterHelper } from '../src/app/helpers/converter.helper';
import { RulesHelper } from '../src/app/helpers/rules.helper';
import { CombatRule } from '../src/app/rules/combat.rule';
import { ConsumeRule } from '../src/app/rules/consume.rule';
import { InteractionRule } from '../src/app/rules/interaction.rule';
import { EquipRule } from '../src/app/rules/equip.rule';
import { PickRule } from '../src/app/rules/pick.rule';
import { SceneRule } from '../src/app/rules/scene.rule';
import { SkillRule } from '../src/app/rules/skill.rule';
import { UnEquipRule } from '../src/app/rules/unequip.rule';
import { UseRule } from '../src/app/rules/use.rule';
import { CharacterService } from '../src/app/services/character.service';
import { GameLoopService } from '../src/app/services/game-loop.service';
import { GeneratorService } from '../src/app/services/generator.service';
import { InventoryService } from '../src/app/services/inventory.service';
import { LoggingService } from '../src/app/services/logging.service';
import { NarrativeService } from '../src/app/services/narrative.service';
import { RandomCharacterService } from '../src/app/services/random-character.service';
import { RandomIntService } from '../src/app/services/random-int.service';
import { RollService } from '../src/app/services/roll.service';
import { SkillService } from '../src/app/services/skill.service';
import { ActionableState } from '../src/app/states/actionable.state';
import { ActionableStore } from '../src/app/stores/actionable.store';
import { InteractiveStore } from '../src/app/stores/interactive.store';
import { ItemStore } from '../src/app/stores/item.store';
import { MessageStore } from '../src/app/stores/message.store';
import { ResourcesStore } from '../src/app/stores/resources.store';
import { SceneStore } from '../src/app/stores/scene.store';
import { StatesStore } from '../src/app/stores/states.store';
import { GameBridgeService } from '../src/app/services/game-bridge.service';
import { GameEventsDefinition } from '../src/app/definitions/game-events.definition';
import { SceneDefinition } from '../src/app/definitions/scene.definition';
import { ArrayView } from '../src/app/views/array.view';
import { WithSubscriptionHelper } from '../src/app/helpers/with-subscription.helper';
import { ProfessionStore } from '../src/app/stores/profession.store';
import { DescriptionStore } from '../src/app/stores/description.store';
import { ActorStore } from '../src/app/stores/actor.store';
import { FormatterHelperService } from '../src/app/helpers/formatter.helper.service';
import { SkillStore } from '../src/app/stores/skill.store';

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
import { InspectRule } from '../src/app/rules/inspect.rule';
import { SettingsStore } from '../src/app/stores/settings.store';

export const mockedInventoryService = mock(InventoryService);

export const mockedPlayerEntity = mock(PlayerEntity);

export const mockedTargetPlayerEntity = mock(PlayerEntity);

export const mockedInteractiveEntity = mock(InteractiveEntity);

export const mockedRollService = mock(RollService);

export const mockedNarrativeService = mock(NarrativeService);

export const mockedItemStore = mock(ItemStore);

export const mockedGameLoopService = mock(GameLoopService);

export const mockedCharacterService = mock(CharacterService);

export const mockedLoggingService = mock(LoggingService);

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

export const mockedRulesHelper = mock(RulesHelper);

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

export const mockedGameBridgeService = mock(GameBridgeService);

export const mockedGameEventsService = mock(GameEventsDefinition);

export const mockedWithSubscriptionHelper = mock(WithSubscriptionHelper);

export const mockedProfessionStore = mock(ProfessionStore);

export const mockedDescriptionStore = mock(DescriptionStore);

export const mockedActorStore = mock(ActorStore);

export const mockedFormatterHelperService = mock(FormatterHelperService);

export const mockedSkillStore = mock(SkillStore);

export const mockedMatDialog = mock(MatDialog);

export const mockedInspectRule = mock(InspectRule);

export const mockedSettingsStore = mock(SettingsStore);

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

  when(mockedActorEntity.classification).thenReturn('ACTOR');

  when(mockedActorEntity.situation).thenReturn('ALIVE');

  when(mockedActorEntity2.id).thenReturn(`${actorInfo.id}2`);

  when(mockedActorEntity2.name).thenReturn(`${actorInfo.name}2`);

  when(mockedActorEntity2.skills).thenReturn(fakeSkills);

  when(mockedActorEntity2.classification).thenReturn('ACTOR');

  when(mockedActorEntity2.situation).thenReturn('ALIVE');

  when(mockedTargetPlayerEntity.name).thenReturn('targetPlayer');

  when(mockedTargetPlayerEntity.classification).thenReturn('PLAYER');

  when(mockedPlayerEntity.situation).thenReturn('ALIVE');

  when(mockedActorBehavior.characteristics).thenReturn(fakeCharacteristics);

  when(mockedActorBehavior.derivedAttributes).thenReturn(fakeDerivedAttributes);

  when(mockedActorBehavior.skills).thenReturn(fakeSkills);

  when(mockedActorBehavior.situation).thenReturn('ALIVE');

  const instanceActorEntity = instance(mockedActorEntity);

  const instanceActorEntity2 = instance(mockedActorEntity2);

  const instancePlayerEntity = instance(mockedPlayerEntity);

  Object.setPrototypeOf(instanceActorEntity, ActorEntity.prototype);

  Object.setPrototypeOf(instanceActorEntity2, ActorEntity.prototype);

  Object.setPrototypeOf(instancePlayerEntity, ActorEntity.prototype);

  // when(mockedNarrativeService.sceneChanged$).thenReturn(
  //   of(instance(mockedSceneEntity))
  // );

  // when(mockedSceneEntity.interactives).thenReturn(
  //   ArrayView.create([instance(mockedInteractiveEntity), instanceActorEntity])
  // );

  when(mockedActorBehavior.characteristics).thenReturn(fakeCharacteristics);

  when(mockedActorBehavior.skills).thenReturn(fakeSkills);

  when(mockedActorBehavior.derivedAttributes).thenReturn(fakeDerivedAttributes);

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
    },
  });

  when(mockedGeneratorService.identity()).thenReturn(fakeIdentity);

  when(mockedGeneratorService.characteristics()).thenReturn(
    fakeCharacteristics
  );

  when(mockedGameBridgeService.events).thenReturn(
    instance(mockedGameEventsService)
  );

  when(mockedGameEventsService.characterChanged$).thenReturn(
    of(instance(mockedPlayerEntity))
  );

  when(mockedGameEventsService.sceneChanged$).thenReturn(
    of(
      new SceneDefinition(
        ArrayView.create(['this is a test', 'okay okay']),
        ArrayView.create([instance(mockedInteractiveEntity)])
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
};

const resetMocks = () => {
  reset(mockedInventoryService);

  reset(mockedPlayerEntity);

  reset(mockedInteractiveEntity);

  reset(mockedRollService);

  reset(mockedNarrativeService);

  reset(mockedGameLoopService);

  reset(mockedCharacterService);

  reset(mockedLoggingService);

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

  reset(mockedRulesHelper);

  reset(mockedSceneStore);

  reset(mockedRandomIntService);

  reset(mockedActionableState);

  reset(mockedActionableState2);

  reset(mockedMessageStore);

  reset(mockedRandomCharacterService);

  reset(mockedSceneEntity);

  reset(mockedUseRule);

  reset(mockedGameBridgeService);

  reset(mockedGameEventsService);

  reset(mockedWithSubscriptionHelper);

  reset(mockedProfessionStore);

  reset(mockedDescriptionStore);

  reset(mockedActorStore);

  reset(mockedFormatterHelperService);

  reset(mockedSkillStore);

  reset(mockedMatDialog);

  reset(mockedInspectRule);

  reset(mockedSettingsStore);

  reset(mockedActorEntity2);
};
