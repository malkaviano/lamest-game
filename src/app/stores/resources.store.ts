import { Injectable } from '@angular/core';

import { SceneStoreInterface } from '../interfaces/scene-store.interface';
import { SkillStateStoreInterface } from '../interfaces/skill-state-store.interface';
import { DiscardStateStoreInterface } from '../interfaces/discard-state-store.interface';
import { SimpleStateStoreInterface } from '../interfaces/simple-state-store.interface';
import { ConversationStateStoreInterface } from '../interfaces/conversation-state-store.interface';
import { DestroyableStateStoreInterface } from '../interfaces/destroyable-state-store.interface';
import { WeaponStoreInterface } from '../interfaces/weapon-store.interface';
import { createDice } from '../definitions/dice.definition';
import { ConsumableStoreInterface } from '../interfaces/consumable-store.interface';
import { InteractiveStoreInterface } from '../interfaces/interactive-store.interface';
import { DescriptionStoreInterface } from '../interfaces/description-store.interface';
import { ActionableStoreInterface } from '../interfaces/actionable-store.interface';
import { ActionableLiteral } from '../literals/actionable.literal';
import { MessageStoreInterface } from '../interfaces/message-store.interface';
import { CharacteristicSetDefinition } from '../definitions/characteristic-set.definition';
import { CharacteristicDefinition } from '../definitions/characteristic.definition';
import { WeaponUsabilityLiteral } from '../literals/weapon-usability';
import { ActorStoreInterface } from '../interfaces/actor-store.interface';
import { UsablesStoreInterface } from '../interfaces/item-store.interface';
import { LockedContainerStateStoreInterface } from '../interfaces/locked-container-state-store';
import { ProfessionStoreInterface } from '../interfaces/stores/profession-store.interface';
import { SkillStoreInterface } from '../interfaces/stores/skill-store.interface';
import { SkillAffinityLiteral } from '../literals/skill-category.literal';
import { EffectTypeLiteral } from '../literals/effect-type.literal';

import sceneStore from '../../assets/scenes.json';
import skillStateStore from '../../assets/states/skill-states.json';
import discardStateStore from '../../assets/states/discard-states.json';
import simpleStateStore from '../../assets/states/simple-states.json';
import conversationStateStore from '../../assets/states/conversation-states.json';
import destroyableStateStore from '../../assets/states/destroyable-states.json';
import weaponStore from '../../assets/items/weapons.json';
import consumableStore from '../../assets/items/consumables.json';
import interactiveStore from '../../assets/interactives.json';
import descriptionStore from '../../assets/descriptions.json';
import actionableStore from '../../assets/actionables.json';
import messageStore from '../../assets/messages.json';
import actorStore from '../../assets/actors.json';
import usablesStore from '../../assets/items/usables.json';
import lockedContainerStateStore from '../../assets/states/locked-container-state.json';
import professionStore from '../../assets/professions.json';
import skillStore from '../../assets/skills.json';
import { ArrayView } from '../views/array.view';

@Injectable({
  providedIn: 'root',
})
export class ResourcesStore {
  public readonly sceneStore: SceneStoreInterface;

  public readonly skillStateStore: SkillStateStoreInterface;

  public readonly discardStateStore: DiscardStateStoreInterface;

  public readonly simpleStateStore: SimpleStateStoreInterface;

  public readonly conversationStateStore: ConversationStateStoreInterface;

  public readonly destroyableStateStore: DestroyableStateStoreInterface;

  public readonly weaponStore: WeaponStoreInterface;

  public readonly consumableStore: ConsumableStoreInterface;

  public readonly interactiveStore: InteractiveStoreInterface;

  public readonly actorStore: ActorStoreInterface;

  public readonly descriptionStore: DescriptionStoreInterface;

  public readonly actionableStore: ActionableStoreInterface;

  public readonly messageStore: MessageStoreInterface;

  public readonly usablesStore: UsablesStoreInterface;

  public readonly lockedContainerStateStore: LockedContainerStateStoreInterface;

  public readonly professionStore: ProfessionStoreInterface;

  public readonly skillStore: SkillStoreInterface;

  constructor() {
    this.sceneStore = sceneStore;

    this.skillStateStore = skillStateStore;

    this.discardStateStore = discardStateStore;

    this.simpleStateStore = simpleStateStore;

    this.conversationStateStore = conversationStateStore;

    this.destroyableStateStore = destroyableStateStore;

    const weapons = weaponStore.weapons.map((w) => {
      return {
        name: w.name,
        label: w.label,
        description: w.description,
        skillName: w.skillName,
        damage: {
          dice: createDice(w.damage.dice),
          fixed: w.damage.fixed,
          effect: w.damage.effect as EffectTypeLiteral,
        },
        dodgeable: w.dodgeable,
        usability: w.usability as WeaponUsabilityLiteral,
      };
    });

    this.weaponStore = { weapons };

    const consumables = consumableStore.consumables.map((c) => {
      return {
        name: c.name,
        label: c.label,
        description: c.description,
        amount: c.amount,
        effect: c.effect as EffectTypeLiteral,
        skillName: c.skillName,
      };
    });

    this.consumableStore = { consumables };

    this.interactiveStore = interactiveStore;

    this.descriptionStore = descriptionStore;

    const actionables = actionableStore.actionables.map((a) => {
      return {
        key: a.key,
        name: a.name,
        actionable: a.actionable as ActionableLiteral,
        label: a.label,
      };
    });

    this.actionableStore = { actionables };

    this.messageStore = messageStore;

    const actors = actorStore.actors.map((a) => {
      const characteristics: CharacteristicSetDefinition = {
        STR: new CharacteristicDefinition('STR', a.characteristics.STR),
        VIT: new CharacteristicDefinition('VIT', a.characteristics.VIT),
        AGI: new CharacteristicDefinition('AGI', a.characteristics.AGI),
        INT: new CharacteristicDefinition('INT', a.characteristics.INT),
        ESN: new CharacteristicDefinition('ESN', a.characteristics.ESN),
        APP: new CharacteristicDefinition('APP', a.characteristics.APP),
      };

      const skills = new Map<string, number>();

      a.skills.forEach((s) => {
        skills.set(s.name, s.value);
      });

      return {
        id: a.id,
        name: a.name,
        description: a.description,
        resettable: a.resettable,
        characteristics: characteristics,
        skills: skills,
        equippedWeapon: a.equippedWeapon,
        killedState: a.killedState,
        behaviorState: a.behaviorState,
        immunities: new ArrayView(a.immunities),
        resistances: new ArrayView(a.resistances),
        cures: new ArrayView(a.cures),
        vulnerabilities: new ArrayView(a.vulnerabilities),
      };
    });

    this.actorStore = { actors };

    this.usablesStore = usablesStore;

    this.lockedContainerStateStore = lockedContainerStateStore;

    this.professionStore = professionStore;

    const skills = skillStore.skills.map((s) => {
      return {
        name: s.name,
        description: s.description,
        affinity: s.affinity as SkillAffinityLiteral,
        combat: s.combat,
        influenced: s.influenced,
      };
    });
    this.skillStore = { skills };
  }
}
