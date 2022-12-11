import { Injectable } from '@angular/core';

import { SceneStoreInterface } from '../interfaces/scene-store.interface';
import { SkillStateStoreInterface } from '../interfaces/skill-state-store.interface';
import { DiscardStateStoreInterface } from '../interfaces/discard-state-store.interface';
import { SimpleStateStoreInterface } from '../interfaces/simple-state-store.interface';
import { ConversationStateStoreInterface } from '../interfaces/conversation-state-store.interface';
import { DestroyableStateStoreInterface } from '../interfaces/destroyable-state-store.interface';
import { WeaponStoreInterface } from '../interfaces/weapon-store.interface';
import { SkillNameLiteral } from '../literals/skill-name.literal';
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

import sceneStore from '../../assets/scenes.json';
import skillStateStore from '../../assets/skill-states.json';
import discardStateStore from '../../assets/discard-states.json';
import simpleStateStore from '../../assets/simple-states.json';
import conversationStateStore from '../../assets/conversation-states.json';
import destroyableStateStore from '../../assets/destroyable-states.json';
import weaponStore from '../../assets/weapons.json';
import consumableStore from '../../assets/consumables.json';
import interactiveStore from '../../assets/interactives.json';
import descriptionStore from '../../assets/descriptions.json';
import actionableStore from '../../assets/actionables.json';
import messageStore from '../../assets/messages.json';
import actorStore from '../../assets/actors.json';

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
        skillName: w.skillName as SkillNameLiteral,
        damage: {
          dice: createDice(w.damage.dice),
          fixed: w.damage.fixed,
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
        hp: c.hp,
        skillName: c.skillName as SkillNameLiteral,
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
        SIZ: new CharacteristicDefinition('SIZ', a.characteristics.SIZ),
        DEX: new CharacteristicDefinition('DEX', a.characteristics.DEX),
        INT: new CharacteristicDefinition('INT', a.characteristics.INT),
        POW: new CharacteristicDefinition('POW', a.characteristics.POW),
        APP: new CharacteristicDefinition('APP', a.characteristics.APP),
      };

      const skills = new Map<SkillNameLiteral, number>();

      a.skills.forEach((s) => {
        skills.set(s.name as SkillNameLiteral, s.value);
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
      };
    });

    this.actorStore = { actors };
  }
}
