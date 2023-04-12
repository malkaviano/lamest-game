import { Injectable } from '@angular/core';

import { SceneStoreInterface } from '../interfaces/stores/scene-store.interface';
import { SkillStateStoreInterface } from '../interfaces/stores/skill-state-store.interface';
import { DiscardStateStoreInterface } from '../interfaces/stores/discard-state-store.interface';
import { SimpleStateStoreInterface } from '../interfaces/simple-state-store.interface';
import { ConversationStateStoreInterface } from '../interfaces/stores/conversation-state-store.interface';
import { DestroyableStateStoreInterface } from '../interfaces/stores/destroyable-state-store.interface';
import { WeaponStoreInterface } from '../interfaces/stores/weapon-store.interface';
import { createDice } from '../definitions/dice.definition';
import { ConsumableStoreInterface } from '../interfaces/stores/consumable-store.interface';
import { InteractiveStoreInterface } from '../interfaces/stores/interactive-store.interface';
import { DescriptionStoreInterface } from '../interfaces/stores/description-store.interface';
import { ActionableStoreInterface } from '../interfaces/stores/actionable-store.interface';
import { ActionableLiteral } from '../literals/actionable.literal';
import { MessageStoreInterface } from '../interfaces/stores/message-store.interface';
import { CharacteristicSetDefinition } from '../definitions/characteristic-set.definition';
import { CharacteristicDefinition } from '../definitions/characteristic.definition';
import { ItemUsabilityLiteral } from '../literals/item-usability';
import { ActorStoreInterface } from '../interfaces/stores/actor-store.interface';
import { UsablesStoreInterface } from '../interfaces/stores/item-store.interface';
import { LockedContainerStateStoreInterface } from '../interfaces/stores/locked-container-state-store';
import { ProfessionStoreInterface } from '../interfaces/stores/profession-store.interface';
import { SkillStoreInterface } from '../interfaces/stores/skill-store.interface';
import { SkillAffinityLiteral } from '../literals/skill-category.literal';
import { EffectTypeLiteral } from '../literals/effect-type.literal';
import { SettingsStoreInterface } from '../interfaces/stores/settings-store.interface';
import { ArrayView } from '../model-views/array.view';
import { ReadableStoreInterface } from '../interfaces/stores/readable-store.interface';
import { VisibilityStateStoreInterface } from '../interfaces/stores/visibility-state-store.interface';

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
import settingsStore from '../../assets/settings.json';
import readableStore from '../../assets/items/readables.json';
import visibilityStateStore from '../../assets/states/visibility-state.json';
import { AiBehaviorLiteral } from '../literals/enemy-behavior.literal';
import { VisibilityLiteral } from '../literals/visibility.literal';

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

  public readonly settingsStore: SettingsStoreInterface;

  public readonly readableStore: ReadableStoreInterface;

  public readonly visibilityStateStore: VisibilityStateStoreInterface;

  constructor() {
    const {
      professionPoints,
      intelligencePoints,
      vulnerabilityCoefficient,
      resistanceCoefficient,
      playerEffectDefenses,
      oneDodgesEveryAgiAmount,
      actionCooldown,
    } = settingsStore.settings;

    const cures = ArrayView.create(
      playerEffectDefenses.cures.map((e) => e as EffectTypeLiteral)
    );

    const immunities = ArrayView.create(
      playerEffectDefenses.immunities.map((e) => e as EffectTypeLiteral)
    );

    const resistances = ArrayView.create(
      playerEffectDefenses.resistances.map((e) => e as EffectTypeLiteral)
    );

    const vulnerabilities = ArrayView.create(
      playerEffectDefenses.vulnerabilities.map((e) => e as EffectTypeLiteral)
    );

    this.settingsStore = {
      settings: {
        professionPoints,
        intelligencePoints,
        vulnerabilityCoefficient,
        resistanceCoefficient,
        oneDodgesEveryAgiAmount,
        playerEffectDefenses: {
          cures,
          immunities,
          resistances,
          vulnerabilities,
        },
        actionCooldown,
      },
    };

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
        usability: c.usability as ItemUsabilityLiteral,
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
        actorSettings: {
          vulnerabilityCoefficient,
          resistanceCoefficient,
          effectDefenses: {
            cures: ArrayView.create(a.cures),
            immunities: ArrayView.create(a.immunities),
            vulnerabilities: ArrayView.create(a.vulnerabilities),
            resistances: ArrayView.create(a.resistances),
          },
          oneDodgesEveryAgiAmount,
        },
        aiBehavior: a.aiBehavior as AiBehaviorLiteral,
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
