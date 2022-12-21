import { TestBed } from '@angular/core/testing';

import { instance } from 'ts-mockito';

import { SkillRule } from '../rules/skill.rule';
import { RuleDispatcherService } from './rule-dispatcher.service';
import { PickRule } from '../rules/pick.rule';
import { EquipRule } from '../rules/equip.rule';
import { UnEquipRule } from '../rules/unequip.rule';
import { SceneRule } from '../rules/scene.rule';
import { ConsumeRule } from '../rules/consume.rule';
import { InteractionRule } from '../rules/interaction.rule';
import { CombatRule } from '../rules/combat.rule';

import {
  mockedCombatRule,
  mockedConsumeRule,
  mockedInteractionRule,
  mockedEquipRule,
  mockedPickRule,
  mockedSceneRule,
  mockedSkillRule,
  mockedUnEquipRule,
  mockedUseRule,
  mockedInspectRule,
} from '../../../tests/mocks';
import { UseRule } from '../rules/use.rule';
import { InspectRule } from '../rules/inspect.rule';

describe('RulesHelper', () => {
  let service: RuleDispatcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SkillRule,
          useValue: instance(mockedSkillRule),
        },
        {
          provide: PickRule,
          useValue: instance(mockedPickRule),
        },
        {
          provide: EquipRule,
          useValue: instance(mockedEquipRule),
        },
        {
          provide: UnEquipRule,
          useValue: instance(mockedUnEquipRule),
        },
        {
          provide: SceneRule,
          useValue: instance(mockedSceneRule),
        },
        {
          provide: ConsumeRule,
          useValue: instance(mockedConsumeRule),
        },
        {
          provide: InteractionRule,
          useValue: instance(mockedInteractionRule),
        },
        {
          provide: CombatRule,
          useValue: instance(mockedCombatRule),
        },
        {
          provide: UseRule,
          useValue: instance(mockedUseRule),
        },
        {
          provide: InspectRule,
          useValue: instance(mockedInspectRule),
        },
      ],
    });

    service = TestBed.inject(RuleDispatcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});