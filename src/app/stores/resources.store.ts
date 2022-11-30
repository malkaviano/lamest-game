import { Injectable } from '@angular/core';

import { SceneStoreInterface } from '../interfaces/scene-store.interface';
import { SkillStateStoreInterface } from '../interfaces/skill-state-store.interface';
import { DiscardStateStoreInterface } from '../interfaces/discard-state-store.interface';
import { SimpleStateStoreInterface } from '../interfaces/simple-state-store.interface';
import { ConversationStateStoreInterface } from '../interfaces/conversation-state-store.interface';
import { DestroyableStateStoreInterface } from '../interfaces/destroyable-state-store.interface';
import { EnemyStateStoreInterface } from '../interfaces/enemy-state-store.interface';
import { WeaponStoreInterface } from '../interfaces/weapon-store.interface';
import { SkillNameLiteral } from '../literals/skill-name.literal';
import { createDice } from '../definitions/dice.definition';
import { ConsumableStoreInterface } from '../interfaces/consumable-store.interface';
import { InteractiveStoreInterface } from '../interfaces/interactive-store.interface';
import { DescriptionStoreInterface } from '../interfaces/description-store.interface';
import { ActionableStoreInterface } from '../interfaces/actionable-store.interface';
import { ActionableLiteral } from '../literals/actionable.literal';
import { MessageStoreInterface } from '../interfaces/message-store.interface';

import sceneStore from '../../assets/scenes.json';
import skillStateStore from '../../assets/skill-states.json';
import discardStateStore from '../../assets/discard-states.json';
import simpleStateStore from '../../assets/simple-states.json';
import conversationStateStore from '../../assets/conversation-states.json';
import destroyableStateStore from '../../assets/destroyable-states.json';
import enemyStateStore from '../../assets/enemy-states.json';
import weaponStore from '../../assets/weapons.json';
import consumableStore from '../../assets/consumables.json';
import interactiveStore from '../../assets/interactives.json';
import descriptionStore from '../../assets/descriptions.json';
import actionableStore from '../../assets/actionables.json';
import messageStore from '../../assets/messages.json';
import { BehaviorLiteral } from '../literals/behavior.literal';

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

  public readonly enemyStateStore: EnemyStateStoreInterface;

  public readonly weaponStore: WeaponStoreInterface;

  public readonly consumableStore: ConsumableStoreInterface;

  public readonly interactiveStore: InteractiveStoreInterface;

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

    const states = enemyStateStore.states.map((s) => {
      return {
        interactiveId: s.interactiveId,
        actionables: s.actionables,
        killedState: s.killedState,
        hitpoints: s.hitpoints,
        attackSkillValue: s.attackSkillValue,
        weaponName: s.weaponName,
        behavior: s.behavior as BehaviorLiteral,
      };
    });

    this.enemyStateStore = { states };

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
        name: a.name,
        actionable: a.actionable as ActionableLiteral,
        label: a.label,
      };
    });

    this.actionableStore = { actionables };

    this.messageStore = messageStore;
  }
}
