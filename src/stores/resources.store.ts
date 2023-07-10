import { SceneStoreInterface } from '@core/interfaces/stores/scene-store.interface';
import { SkillStateStoreInterface } from '@core/interfaces/stores/skill-state-store.interface';
import { DiscardStateStoreInterface } from '@core/interfaces/stores/discard-state-store.interface';
import { SimpleStateStoreInterface } from '@core/interfaces/simple-state-store.interface';
import { ConversationStateStoreInterface } from '@core/interfaces/stores/conversation-state-store.interface';
import { DestroyableStateStoreInterface } from '@core/interfaces/stores/destroyable-state-store.interface';
import { WeaponStoreInterface } from '@core/interfaces/stores/weapon-store.interface';
import { createDice } from '@core/definitions/dice.definition';
import { ConsumableStoreInterface } from '@core/interfaces/stores/consumable-store.interface';
import { InteractiveStoreInterface } from '@core/interfaces/stores/interactive-store.interface';
import { ActionableStoreInterface } from '@core/interfaces/stores/actionable-store.interface';
import { ActionableLiteral } from '@core/literals/actionable.literal';
import { MessageStoreInterface } from '@core/interfaces/stores/message-store.interface';
import { CharacteristicSetDefinition } from '@core/definitions/characteristic-set.definition';
import { CharacteristicDefinition } from '@core/definitions/characteristic.definition';
import { ItemUsabilityLiteral } from '@core/literals/item-usability';
import { ActorStoreInterface } from '@core/interfaces/stores/actor-store.interface';
import { UsablesStoreInterface } from '@core/interfaces/stores/item-store.interface';
import { LockedContainerStateStoreInterface } from '@core/interfaces/stores/locked-container-state-store';
import { ProfessionStoreInterface } from '@core/interfaces/stores/profession-store.interface';
import { SkillStoreInterface } from '@core/interfaces/stores/skill-store.interface';
import { SkillAffinityLiteral } from '@core/literals/skill-category.literal';
import { EffectTypeLiteral } from '@core/literals/effect-type.literal';
import { ReadableStoreInterface } from '@core/interfaces/stores/readable-store.interface';
import { VisibilityStateStoreInterface } from '@core/interfaces/stores/visibility-state-store.interface';
import { ArrayView } from '@core/view-models/array.view';
import { BehaviorLiteral } from '@core/literals/behavior.literal';
import { VisibilityLiteral } from '@core/literals/visibility.literal';
import { SettingsStore } from './settings.store';

import sceneStore from '../assets/scenes.json';
import skillStateStore from '../assets/states/skill-states.json';
import discardStateStore from '../assets/states/discard-states.json';
import simpleStateStore from '../assets/states/simple-states.json';
import conversationStateStore from '../assets/states/conversation-states.json';
import destroyableStateStore from '../assets/states/destroyable-states.json';
import weaponStore from '../assets/items/weapons.json';
import consumableStore from '../assets/items/consumables.json';
import interactiveStore from '../assets/interactives.json';
import actionableStore from '../assets/actionables.json';
import messageStore from '../assets/messages.json';
import actorStore from '../assets/actors.json';
import usablesStore from '../assets/items/usables.json';
import lockedContainerStateStore from '../assets/states/locked-container-state.json';
import professionStore from '../assets/professions.json';
import skillStore from '../assets/skills.json';
import readableStore from '../assets/items/readables.json';
import visibilityStateStore from '../assets/states/visibility-state.json';

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

  public readonly actionableStore: ActionableStoreInterface;

  public readonly messageStore: MessageStoreInterface;

  public readonly usablesStore: UsablesStoreInterface;

  public readonly lockedContainerStateStore: LockedContainerStateStoreInterface;

  public readonly professionStore: ProfessionStoreInterface;

  public readonly skillStore: SkillStoreInterface;

  public readonly readableStore: ReadableStoreInterface;

  public readonly visibilityStateStore: VisibilityStateStoreInterface;

  constructor() {
    this.sceneStore = sceneStore;

    this.skillStateStore = skillStateStore;

    this.visibilityStateStore = visibilityStateStore;

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
        usability: w.usability as ItemUsabilityLiteral,
        energyActivation: w.energyActivation,
      };
    });

    this.weaponStore = { weapons };

    const consumables = consumableStore.consumables.map((c) => {
      return {
        name: c.name,
        label: c.label,
        description: c.description,
        hp: c.hp,
        energy: c.energy,
        effect: c.effect as EffectTypeLiteral,
        skillName: c.skillName,
      };
    });

    this.consumableStore = { consumables };

    this.interactiveStore = interactiveStore;

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
        actorSettings: {
          vulnerabilityCoefficient:
            SettingsStore.settings.vulnerabilityCoefficient,
          resistanceCoefficient: SettingsStore.settings.resistanceCoefficient,
          effectDefenses: {
            cures: ArrayView.fromArray(a.cures),
            immunities: ArrayView.fromArray(a.immunities),
            vulnerabilities: ArrayView.fromArray(a.vulnerabilities),
            resistances: ArrayView.fromArray(a.resistances),
          },
          oneDodgesEveryAgiAmount:
            SettingsStore.settings.oneDodgeEveryAgiAmount,
        },
        aiBehavior: a.aiBehavior as BehaviorLiteral,
        ignores: a.ignores.map((i) => i as VisibilityLiteral),
        visibility: a.visibility as VisibilityLiteral,
      };
    });

    this.actorStore = { actors };

    const usables = usablesStore.usables.map((u) => {
      return {
        name: u.name,
        label: u.label,
        description: u.description,
        usability: u.usability as ItemUsabilityLiteral,
      };
    });

    this.usablesStore = { usables };

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

    const readables = readableStore.readables.map((r) => {
      return {
        name: r.name,
        label: r.label,
        description: r.description,
        title: r.title,
        text: r.text,
        usability: r.usability as ItemUsabilityLiteral,
      };
    });

    this.readableStore = { readables };
  }
}
