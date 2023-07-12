import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RandomIntHelper } from '@helpers/random-int.helper';
import { DodgeAxiom } from '@axioms/dodge.axiom';
import { ResourcesStore } from '@stores/resources.store';
import { ActionableStore } from '@stores/actionable.store';
import { ItemStore } from '@stores/item.store';
import { MessageStore } from '@stores/message.store';
import { ProfessionStore } from '@stores/profession.store';
import { SkillStore } from '@stores/skill.store';
import { StatesStore } from '@stores/states.store';
import { GeneratorService } from '@services/generator.service';
import { ActorStore } from '@stores/actor.store';
import { InventoryService } from '@services/inventory.service';
import { InteractiveStore } from '@stores/interactive.store';
import { SceneStore } from '@stores/scene.store';
import { SequencerHelper } from '@helpers/sequencer.helper';
import { CheckedService } from '@services/checked.service';
import { RollHelper } from '@helpers/roll.helper';
import { AffectRule } from '@rules/affect.rule';
import { ConsumeRule } from '@rules/consume.rule';
import { EquipRule } from '@rules/equip.rule';
import { ReadRule } from '@rules/read.rule';
import { InteractionRule } from '@rules/interaction.rule';
import { PickRule } from '@rules/pick.rule';
import { SceneRule } from '@rules/scene.rule';
import { SkillRule } from '@rules/skill.rule';
import { UnEquipRule } from '@rules/unequip.rule';
import { UseRule } from '@rules/use.rule';
import { NarrativeService } from '@services/narrative.service';
import { RulesHub } from '@hubs/rules.hub';
import { VisibilityPolicy } from '@policies/visibility.policy';
import { PolicyHub } from '@hubs/policy.hub';
import { GameLoopService } from '@services/game-loop.service';
import { CharacterService } from '@services/character.service';
import { RandomCharacterService } from '@services/random-character.service';
import { SkillService } from '@services/skill.service';
import { LoggingHub } from '@hubs/logging.hub';
import { ActionPolicy } from '@policies/action.policy';
import { GamePredicate } from '@predicates/game.predicate';

const gamePredicate = new GamePredicate();

const randomIntHelper = new RandomIntHelper();
const sequencerHelper = new SequencerHelper(randomIntHelper);
const rollHelper = new RollHelper(randomIntHelper, gamePredicate);

const resourcesStore = new ResourcesStore();
const actionableStore = new ActionableStore(resourcesStore);
const itemStore = new ItemStore(resourcesStore);
const messageStore = new MessageStore(resourcesStore);
const professionStore = new ProfessionStore(resourcesStore);
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
  skillStore
);
const interactiveStore = new InteractiveStore(statesStore, resourcesStore);
const sceneStore = new SceneStore(interactiveStore, actorStore, resourcesStore);

const inventoryService = new InventoryService(interactiveStore, itemStore);
const generatorService = new GeneratorService(randomIntHelper, professionStore);
const narrativeService = new NarrativeService(sceneStore);
const checkedService = new CheckedService();

const dodgeAxiom = new DodgeAxiom(rollHelper, gamePredicate);

const combatRule = new AffectRule(
  rollHelper,
  checkedService,
  dodgeAxiom,
  gamePredicate
);
const consumeRule = new ConsumeRule(
  inventoryService,
  rollHelper,
  checkedService,
  gamePredicate
);

const equipRule = new EquipRule(
  inventoryService,
  checkedService,
  gamePredicate
);
const inspectRule = new ReadRule(inventoryService);
const interactionRule = new InteractionRule(checkedService);
const pickRule = new PickRule(inventoryService, checkedService);
const sceneRule = new SceneRule(narrativeService, checkedService);
const skillRule = new SkillRule(rollHelper, checkedService, gamePredicate);
const unEquipRule = new UnEquipRule(inventoryService);
const useRule = new UseRule(inventoryService, checkedService);

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

const visibilityPolicy = new VisibilityPolicy();

const actionPolicy = new ActionPolicy();

const policyHub = new PolicyHub(visibilityPolicy, actionPolicy);

const loggingHub = new LoggingHub(
  rollHelper,
  rulesHub,
  policyHub,
  gamePredicate
);

const skillService = new SkillService(randomIntHelper);

const rngCharacterService = new RandomCharacterService(
  generatorService,
  skillService,
  professionStore,
  skillStore
);

const characterService = new CharacterService(rngCharacterService);

const gameLoopService = new GameLoopService(
  rulesHub,
  characterService,
  narrativeService,
  policyHub,
  gamePredicate,
  inventoryService,
  loggingHub
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
    { provide: SkillStore, useValue: skillStore },
    { provide: StatesStore, useValue: statesStore },
    { provide: ActorStore, useValue: actorStore },
    { provide: InteractiveStore, useValue: interactiveStore },
    { provide: SceneStore, useValue: sceneStore },

    { provide: DodgeAxiom, useValue: dodgeAxiom },

    { provide: CheckedService, useValue: checkedService },
    { provide: GeneratorService, useValue: generatorService },
    { provide: InventoryService, useValue: inventoryService },
    { provide: NarrativeService, useValue: narrativeService },

    { provide: AffectRule, useValue: combatRule },
    { provide: ConsumeRule, useValue: consumeRule },
    { provide: EquipRule, useValue: equipRule },
    { provide: ReadRule, useValue: inspectRule },
    { provide: InteractionRule, useValue: interactionRule },
    { provide: PickRule, useValue: pickRule },
    { provide: SceneRule, useValue: sceneRule },
    { provide: SkillRule, useValue: skillRule },
    { provide: UnEquipRule, useValue: unEquipRule },
    { provide: UseRule, useValue: useRule },

    { provide: RulesHub, useValue: rulesHub },
    { provide: PolicyHub, useValue: policyHub },

    { provide: SkillService, useValue: skillService },
    { provide: RandomCharacterService, useValue: rngCharacterService },
    { provide: CharacterService, useValue: characterService },
    { provide: GameLoopService, useValue: gameLoopService },

    { provide: LoggingHub, useValue: loggingHub },

    { provide: GamePredicate, useValue: GamePredicate },
  ],
  imports: [CommonModule],
})
export class ProvidersModule {}
