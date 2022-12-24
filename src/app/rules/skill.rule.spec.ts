import { TestBed } from '@angular/core/testing';

import { instance, when } from 'ts-mockito';

import { RollService } from '../services/roll.service';
import { SkillRule } from './skill.rule';
import { ExtractorHelper } from '../helpers/extractor.helper';
import { RollDefinition } from '../definitions/roll.definition';
import { AffectAxiomService } from './axioms/affect.axiom.service';

import {
  mockedPlayerEntity,
  mockedInteractiveEntity,
  mockedRollService,
  setupMocks,
  mockedExtractorHelper,
  mockedAffectedAxiomService,
} from '../../../tests/mocks';
import {
  actionableEvent,
  actionSkillSurvival,
  interactiveInfo,
} from '../../../tests/fakes';

describe('SkillRule', () => {
  let service: SkillRule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RollService,
          useValue: instance(mockedRollService),
        },
        {
          provide: ExtractorHelper,
          useValue: instance(mockedExtractorHelper),
        },
        {
          provide: AffectAxiomService,
          useValue: instance(mockedAffectedAxiomService),
        },
      ],
    });

    setupMocks();

    service = TestBed.inject(SkillRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    it('should log target log', () => {
      when(
        mockedRollService.actorSkillCheck(
          actor,
          eventSkillSurvival.actionableDefinition.name
        )
      ).thenReturn(new RollDefinition('SUCCESS', 10));

      const spy = spyOn(instance(mockedAffectedAxiomService), 'affectWith');

      service.execute(actor, eventSkillSurvival, extras);

      expect(spy).toHaveBeenCalled();
    });
  });
});

const actor = instance(mockedPlayerEntity);

const target = instance(mockedInteractiveEntity);

const extras = {
  actorVisibility: actor,
  target,
};

const eventSkillSurvival = actionableEvent(
  actionSkillSurvival,
  interactiveInfo.id
);
