import { SceneStoreInterface } from '@interfaces/stores/scene-store.interface';
import { SkillStateStoreInterface } from '@interfaces/stores/skill-state-store.interface';
import { DiscardStateStoreInterface } from '@interfaces/stores/discard-state-store.interface';
import { SimpleStateStoreInterface } from '@interfaces/simple-state-store.interface';
import { ConversationStateStoreInterface } from '@interfaces/stores/conversation-state-store.interface';
import { DestroyableStateStoreInterface } from '@interfaces/stores/destroyable-state-store.interface';
import { WeaponStoreInterface } from '@interfaces/stores/weapon-store.interface';
import { createDice } from '@definitions/dice.definition';
import { ConsumableStoreInterface } from '@interfaces/stores/consumable-store.interface';
import { InteractiveStoreInterface } from '@interfaces/stores/interactive-store.interface';
import { ActionableStoreInterface } from '@interfaces/stores/actionable-store.interface';
import { ActionableLiteral } from '@literals/actionable.literal';
import { MessageStoreInterface } from '@interfaces/stores/message-store.interface';
import { CharacteristicSetDefinition } from '@definitions/characteristic-set.definition';
import { CharacteristicDefinition } from '@definitions/characteristic.definition';
import { ItemUsabilityLiteral } from '@literals/item-usability';
import { ActorStoreInterface } from '@interfaces/stores/actor-store.interface';
import { UsablesStoreInterface } from '@interfaces/stores/item-store.interface';
import { LockedContainerStateStoreInterface } from '@interfaces/stores/locked-container-state-store';
import { ProfessionStoreInterface } from '@interfaces/stores/profession-store.interface';
import { SkillStoreInterface } from '@interfaces/stores/skill-store.interface';
import { SkillAffinityLiteral } from '@literals/skill-category.literal';
import { EffectTypeLiteral } from '@literals/effect-type.literal';
import { ReadableStoreInterface } from '@interfaces/stores/readable-store.interface';
import { ArrayView } from '@wrappers/array.view';
import { BehaviorLiteral } from '@literals/behavior.literal';
import { VisibilityLiteral } from '@literals/visibility.literal';
import { SettingsStore } from '@stores/settings.store';
import { ItemQualityLiteral } from '@literals/item-quality.literal';
import { ArmorStoreInterface } from '@interfaces/stores/armor-store.interface';
import { ArmorPenaltyLiteral } from '@literals/armor-penalty.literal';

import sceneStore from '@assets/scenes.json';
import skillStateStore from '@assets/states/skill-states.json';
import discardStateStore from '@assets/states/discard-states.json';
import simpleStateStore from '@assets/states/simple-states.json';
import conversationStateStore from '@assets/states/conversation-states.json';
import destroyableStateStore from '@assets/states/destroyable-states.json';
import weaponStore from '@assets/items/weapons.json';
import consumableStore from '@assets/items/consumables.json';
import interactiveStore from '@assets/interactives.json';
import actionableStore from '@assets/actionables.json';
import messageStore from '@assets/messages.json';
import actorStore from '@assets/actors.json';
import usablesStore from '@assets/items/usables.json';
import lockedContainerStateStore from '@assets/states/locked-container-state.json';
import professionStore from '@assets/professions.json';
import skillStore from '@assets/skills.json';
import readableStore from '@assets/items/readables.json';
import armorStore from '@assets/items/armor.json';

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

  public readonly armorStore: ArmorStoreInterface;

  constructor() {
    this.sceneStore = sceneStore;

    this.skillStateStore = skillStateStore;

    this.discardStateStore = discardStateStore;

    this.simpleStateStore = simpleStateStore;

    this.conversationStateStore = conversationStateStore;

    this.destroyableStateStore = destroyableStateStore;

    const weapons = this.extractWeapons();

    this.weaponStore = { weapons };

    const consumables = this.extractConsumables();

    this.consumableStore = { consumables };

    this.interactiveStore = interactiveStore;

    const actionables = this.extractActionables();

    this.actionableStore = { actionables };

    this.messageStore = messageStore;

    const actors = this.extractActors();

    this.actorStore = { actors };

    const usables = this.extractUsables();

    this.usablesStore = { usables };

    this.lockedContainerStateStore = lockedContainerStateStore;

    this.professionStore = professionStore;

    const skills = this.extractSkills();

    this.skillStore = { skills };

    const readables = this.extractReadables();

    this.readableStore = { readables };

    const armor = this.extractArmor();

    this.armorStore = { armor };
  }

  private extractWeapons() {
    return weaponStore.weapons.map((w) => {
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
        energyActivation: w.energyActivation ?? 0,
        quality: (w.quality ?? 'COMMON') as ItemQualityLiteral,
      };
    });
  }

  private extractConsumables() {
    return consumableStore.consumables.map((c) => {
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
  }

  private extractActionables() {
    return actionableStore.actionables.map((a) => {
      return {
        key: a.key,
        name: a.name,
        actionable: a.actionable as ActionableLiteral,
        label: a.label,
      };
    });
  }

  private extractActors() {
    return actorStore.actors.map((a) => {
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
        characteristics: characteristics,
        skills: skills,
        equippedWeapon: a.equippedWeapon,
        lootState: a.lootState,
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
  }

  private extractUsables() {
    return usablesStore.usables.map((u) => {
      return {
        name: u.name,
        label: u.label,
        description: u.description,
        usability: u.usability as ItemUsabilityLiteral,
      };
    });
  }

  private extractSkills() {
    return skillStore.skills.map((s) => {
      return {
        name: s.name,
        description: s.description,
        affinity: s.affinity as SkillAffinityLiteral,
        combat: s.combat,
        influenced: s.influenced,
      };
    });
  }

  private extractReadables() {
    return readableStore.readables.map((r) => {
      return {
        name: r.name,
        label: r.label,
        description: r.description,
        title: r.title,
        text: r.text,
        usability: r.usability as ItemUsabilityLiteral,
      };
    });
  }

  private extractArmor() {
    return armorStore.armor.map((a) => {
      return {
        name: a.name,
        label: a.label,
        description: a.description,
        damageReduction: a.damageReduction,
        armorPenalty: a.armorPenalty as ArmorPenaltyLiteral,
      };
    });
  }
}
