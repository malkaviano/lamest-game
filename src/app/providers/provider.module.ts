import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RandomIntHelper } from '../../core/helpers/random-int.helper';
import { ActivationAxiom } from '../../core/axioms/activation.axiom';
import { AffectAxiom } from '../../core/axioms/affect.axiom';
import { DodgeAxiom } from '../../core/axioms/dodge.axiom';
import { ReadAxiom } from '../../core/axioms/read.axiom';
import { ResourcesStore } from '../../stores/resources.store';
import { ActionableStore } from '../../stores/actionable.store';
import { ItemStore } from '../../stores/item.store';
import { MessageStore } from '../../stores/message.store';
import { ProfessionStore } from '../../stores/profession.store';
import { SettingsStore } from '../../stores/settings.store';
import { SkillStore } from '../../stores/skill.store';
import { StatesStore } from '../../stores/states.store';
import { GeneratorService } from '../../backend/services/generator.service';
import { ActorStore } from '../../stores/actor.store';
import { InventoryService } from '../../backend/services/inventory.service';
import { InteractiveStore } from '../../stores/interactive.store';
import { SceneStore } from '../../stores/scene.store';
import { SequencerHelper } from '../../core/helpers/sequencer.helper';
import { CheckedService } from '../../backend/services/checked.service';
import { RollHelper } from '../../core/helpers/roll.helper';
import { CombatRule } from '../../backend/rules/combat.rule';
import { ConsumeRule } from '../../backend/rules/consume.rule';
import { EquipRule } from '../../backend/rules/equip.rule';
import { InspectRule } from '../../backend/rules/inspect.rule';
import { InteractionRule } from '../../backend/rules/interaction.rule';
import { PickRule } from '../../backend/rules/pick.rule';
import { SceneRule } from '../../backend/rules/scene.rule';
import { SkillRule } from '../../backend/rules/skill.rule';
import { UnEquipRule } from '../../backend/rules/unequip.rule';
import { UseRule } from '../../backend/rules/use.rule';
import { NarrativeService } from '../../backend/services/narrative.service';
import { EventsHub } from '../../backend/services/events.hub';
import { RulesHub } from '../../backend/services/rules.hub';

const randomIntHelper = new RandomIntHelper();
const sequencerHelper = new SequencerHelper(randomIntHelper);
const rollHelper = new RollHelper(randomIntHelper);

const resourcesStore = new ResourcesStore();
const actionableStore = new ActionableStore(resourcesStore);
const itemStore = new ItemStore(resourcesStore);
const messageStore = new MessageStore(resourcesStore);
const professionStore = new ProfessionStore(resourcesStore);
const settingsStore = new SettingsStore(resourcesStore);
const skillStore = new SkillStore(resourcesStore);
const statesStore = new StatesStore(
  messageStore,
  actionableStore,
  resourcesStore,
  sequencerHelper
);
const actorStore = new ActorStore(
  statesStore,
  resourcesStore,
  itemStore,
  skillStore,
  settingsStore
);
const interactiveStore = new InteractiveStore(statesStore, resourcesStore);
const sceneStore = new SceneStore(interactiveStore, actorStore, resourcesStore);

const inventoryService = new InventoryService(interactiveStore, itemStore);
const generatorService = new GeneratorService(randomIntHelper, professionStore);
const narrativeService = new NarrativeService(sceneStore);
const checkedService = new CheckedService();

const activationAxiom = new ActivationAxiom();
const affectAxiom = new AffectAxiom();
const dodgeAxiom = new DodgeAxiom(rollHelper);
const readAxiom = new ReadAxiom();

const combatRule = new CombatRule(
  rollHelper,
  checkedService,
  activationAxiom,
  dodgeAxiom,
  affectAxiom
);
const consumeRule = new ConsumeRule(
  inventoryService,
  rollHelper,
  checkedService,
  affectAxiom
);
const equipRule = new EquipRule(inventoryService, checkedService);
const inspectRule = new InspectRule(inventoryService, readAxiom);
const interactionRule = new InteractionRule(checkedService);
const pickRule = new PickRule(inventoryService, checkedService, affectAxiom);
const sceneRule = new SceneRule(narrativeService, checkedService);
const skillRule = new SkillRule(rollHelper, checkedService, affectAxiom);
const unEquipRule = new UnEquipRule(inventoryService);
const useRule = new UseRule(inventoryService, checkedService, affectAxiom);

const rulesHub = new RulesHub(
  skillRule,
  pickRule,
  equipRule,
  unEquipRule,
  sceneRule,
  combatRule,
  consumeRule,
  interactionRule,
  useRule,
  inspectRule
);
const eventsHub = new EventsHub(
  rollHelper,
  rulesHub,
  dodgeAxiom,
  activationAxiom,
  affectAxiom,
  readAxiom
);

@NgModule({
  declarations: [],
  providers: [
    { provide: RandomIntHelper, useValue: randomIntHelper },
    { provide: SequencerHelper, useValue: sequencerHelper },
    { provide: RollHelper, useValue: rollHelper },

    { provide: ResourcesStore, useValue: resourcesStore },
    { provide: ActionableStore, useValue: actionableStore },
    { provide: ItemStore, useValue: itemStore },
    { provide: MessageStore, useValue: messageStore },
    { provide: ProfessionStore, useValue: professionStore },
    { provide: SettingsStore, useValue: settingsStore },
    { provide: SkillStore, useValue: skillStore },
    { provide: StatesStore, useValue: statesStore },
    { provide: ActorStore, useValue: actorStore },
    { provide: InteractiveStore, useValue: interactiveStore },
    { provide: SceneStore, useValue: sceneStore },

    { provide: ActivationAxiom, useValue: activationAxiom },
    { provide: AffectAxiom, useValue: affectAxiom },
    { provide: ReadAxiom, useValue: readAxiom },
    { provide: DodgeAxiom, useValue: dodgeAxiom },

    { provide: CheckedService, useValue: checkedService },
    { provide: GeneratorService, useValue: generatorService },
    { provide: InventoryService, useValue: inventoryService },
    { provide: NarrativeService, useValue: narrativeService },

    { provide: CombatRule, useValue: combatRule },
    { provide: ConsumeRule, useValue: consumeRule },
    { provide: EquipRule, useValue: equipRule },
    { provide: InspectRule, useValue: inspectRule },
    { provide: InteractionRule, useValue: interactionRule },
    { provide: PickRule, useValue: pickRule },
    { provide: SceneRule, useValue: sceneRule },
    { provide: SkillRule, useValue: skillRule },
    { provide: UnEquipRule, useValue: unEquipRule },
    { provide: UseRule, useValue: useRule },

    { provide: RulesHub, useValue: rulesHub },
    { provide: EventsHub, useValue: eventsHub },
  ],
  imports: [CommonModule],
})
export class ProvidersModule {}