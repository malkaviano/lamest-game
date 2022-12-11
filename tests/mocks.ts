import { instance, mock, reset, when } from 'ts-mockito';

import { ActorBehavior } from '../src/app/behaviors/actor.behavior';
import { EquipmentBehavior } from '../src/app/behaviors/equipment.behavior';
import { ActorEntity } from '../src/app/entities/actor.entity';
import { InteractiveEntity } from '../src/app/entities/interactive.entity';
import { PlayerEntity } from '../src/app/entities/player.entity';
import { ConverterHelper } from '../src/app/helpers/converter.helper';
import { RulesHelper } from '../src/app/helpers/rules.helper';
import { CombatRule } from '../src/app/rules/combat.rule';
import { ConsumeRule } from '../src/app/rules/consume.rule';
import { ConversationRule } from '../src/app/rules/conversation.rule';
import { EquipRule } from '../src/app/rules/equip.rule';
import { PickRule } from '../src/app/rules/pick.rule';
import { SceneRule } from '../src/app/rules/scene.rule';
import { SkillRule } from '../src/app/rules/skill.rule';
import { UnEquipRule } from '../src/app/rules/unequip.rule';
import { CharacterService } from '../src/app/services/character.service';
import { GameLoopService } from '../src/app/services/game-loop.service';
import { InventoryService } from '../src/app/services/inventory.service';
import { LoggingService } from '../src/app/services/logging.service';
import { NarrativeService } from '../src/app/services/narrative.service';
import { RandomIntService } from '../src/app/services/random-int.service';
import { RollService } from '../src/app/services/roll.service';
import { ActionableState } from '../src/app/states/actionable.state';
import { ActionableStore } from '../src/app/stores/actionable.store';
import { InteractiveStore } from '../src/app/stores/interactive.store';
import { ItemStore } from '../src/app/stores/item.store';
import { MessageStore } from '../src/app/stores/message.store';
import { ResourcesStore } from '../src/app/stores/resources.store';
import { SceneStore } from '../src/app/stores/scene.store';
import { StatesStore } from '../src/app/stores/states.store';

import {
  fakeCharacteristics,
  fakeDerivedAttributes,
  fakeSkills,
  simpleSword,
} from './fakes';

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

export const mockedConversationRule = mock(ConversationRule);

export const mockedCombatRule = mock(CombatRule);

export const mockedRulesHelper = mock(RulesHelper);

export const mockedSceneStore = mock(SceneStore);

export const mockedInteractiveStore = mock(InteractiveStore);

export const mockedRngService = mock(RandomIntService);

export const mockedActionableState = mock<ActionableState>();

export const mockedActionableState2 = mock<ActionableState>();

export const mockedMessageStore = mock(MessageStore);

export const mockedActionableStore = mock(ActionableStore);

export const setupMocks = () => {
  resetMocks();

  when(mockedCharacterService.currentCharacter).thenReturn(
    instance(mockedPlayerEntity)
  );

  when(mockedPlayerEntity.id).thenReturn('player');

  when(mockedPlayerEntity.name).thenReturn('player');

  when(mockedPlayerEntity.classification).thenReturn('PLAYER');

  when(mockedPlayerEntity.skills).thenReturn(fakeSkills);

  when(mockedInteractiveEntity.id).thenReturn('id1');

  when(mockedInteractiveEntity.name).thenReturn('test');

  when(mockedInteractiveEntity.classification).thenReturn('REACTIVE');

  when(mockedActorEntity.name).thenReturn('actor');

  when(mockedActorEntity.skills).thenReturn(fakeSkills);

  when(mockedActorEntity.classification).thenReturn('ACTOR');

  when(mockedTargetPlayerEntity.name).thenReturn('targetPlayer');

  when(mockedTargetPlayerEntity.classification).thenReturn('PLAYER');

  when(mockedActorBehavior.characteristics).thenReturn(fakeCharacteristics);

  when(mockedActorBehavior.derivedAttributes).thenReturn(fakeDerivedAttributes);

  when(mockedActorBehavior.skills).thenReturn(fakeSkills);

  when(mockedActorBehavior.situation).thenReturn('ALIVE');

  const instanceActorEntity = instance(mockedActorEntity);

  Object.setPrototypeOf(instanceActorEntity, ActorEntity.prototype);

  when(mockedNarrativeService.interatives).thenReturn({
    id1: instance(mockedInteractiveEntity),
    actor: instanceActorEntity,
  });

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

  when(mockedResourcesStore.propsStore).thenReturn({
    props: [],
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

  reset(mockedConversationRule);

  reset(mockedCombatRule);

  reset(mockedRulesHelper);

  reset(mockedSceneStore);

  reset(mockedRngService);

  reset(mockedActionableState);

  reset(mockedActionableState2);

  reset(mockedMessageStore);
};
