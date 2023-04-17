import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RandomIntHelper } from '../../core/helpers/random-int.helper';
import { CheckedHelper } from '../../backend/helpers/checked.helper';
import { ActivationAxiom } from '../../backend/axioms/activation.axiom';
import { AffectAxiom } from '../../backend/axioms/affect.axiom';
import { DodgeAxiom } from '../../backend/axioms/dodge.axiom';
import { ReadAxiom } from '../../backend/axioms/read.axiom';
import { RollService } from '../../backend/services/roll.service';
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

const resourcesStore = new ResourcesStore();
const actionableStore = new ActionableStore(resourcesStore);
const itemStore = new ItemStore(resourcesStore);
const messageStore = new MessageStore(resourcesStore);
const professionStore = new ProfessionStore(resourcesStore);
const settingsStore = new SettingsStore(resourcesStore);
const skillStore = new SkillStore(resourcesStore);

const randomIntHelper = new RandomIntHelper();
const generatorService = new GeneratorService(randomIntHelper, professionStore);

const statesStore = new StatesStore(
  messageStore,
  actionableStore,
  resourcesStore,
  generatorService
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

const checkedHelper = new CheckedHelper();
const rollService = new RollService(randomIntHelper);
const inventoryService = new InventoryService(interactiveStore, itemStore);

const activationAxiom = new ActivationAxiom();
const affectAxiom = new AffectAxiom();
const dodgeAxiom = new DodgeAxiom(rollService);
const readAxiom = new ReadAxiom();

@NgModule({
  declarations: [],
  providers: [
    { provide: RandomIntHelper, useValue: randomIntHelper },
    { provide: CheckedHelper, useValue: checkedHelper },
    { provide: RollService, useValue: rollService },
    { provide: GeneratorService, useValue: generatorService },
    { provide: InventoryService, useValue: inventoryService },
    { provide: ActivationAxiom, useValue: activationAxiom },
    { provide: AffectAxiom, useValue: affectAxiom },
    { provide: ReadAxiom, useValue: readAxiom },
    { provide: DodgeAxiom, useValue: dodgeAxiom },
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
  ],
  imports: [CommonModule],
})
export class ProvidersModule {}
