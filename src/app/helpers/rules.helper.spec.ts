import { TestBed } from '@angular/core/testing';

import { instance } from 'ts-mockito';

import { SkillRule } from '../rules/skill.rule';
import { RulesHelper } from './rules.helper';
import { PickRule } from '../rules/pick.rule';
import { EquipRule } from '../rules/equip.rule';
import { UnEquipRule } from '../rules/unequip.rule';
import { SceneRule } from '../rules/scene.rule';
import { ConsumeRule } from '../rules/consume.rule';
import { ConversationRule } from '../rules/conversation.rule';
import { CombatRule } from '../rules/combat.rule';

import {
  mockedCombatRule,
  mockedConsumeRule,
  mockedConversationRule,
  mockedEquipRule,
  mockedPickRule,
  mockedSceneRule,
  mockedSkillRule,
  mockedUnEquipRule,
  mockedUseRule,
} from '../../../tests/mocks';
import { UseRule } from '../rules/use.rule';

describe('RulesHelper', () => {
  let service: RulesHelper;

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
          provide: ConversationRule,
          useValue: instance(mockedConversationRule),
        },
        {
          provide: CombatRule,
          useValue: instance(mockedCombatRule),
        },
        {
          provide: UseRule,
          useValue: instance(mockedUseRule),
        },
      ],
    });

    service = TestBed.inject(RulesHelper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
