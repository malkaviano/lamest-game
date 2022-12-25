import { TestBed } from '@angular/core/testing';

import { instance, when } from 'ts-mockito';

import { InventoryService } from '../services/inventory.service';
import { PickRule } from './pick.rule';
import { CheckedHelper } from '../helpers/checked.helper';
import { AffectAxiomService } from '../axioms/affect.axiom.service';

import {
  mockedAffectedAxiomService,
  mockedExtractorHelper,
  mockedInventoryService,
  mockedPlayerEntity,
  setupMocks,
} from '../../../tests/mocks';
import {
  actionableEvent,
  actionPickSimpleSword,
  interactiveInfo,
  simpleSword,
} from '../../../tests/fakes';

describe('PickRule', () => {
  let service: PickRule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: InventoryService,
          useValue: instance(mockedInventoryService),
        },
        {
          provide: CheckedHelper,
          useValue: instance(mockedExtractorHelper),
        },
        {
          provide: AffectAxiomService,
          useValue: instance(mockedAffectedAxiomService),
        },
      ],
    });

    setupMocks();

    service = TestBed.inject(PickRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    it('should store the item', () => {
      when(
        mockedExtractorHelper.extractItemOrThrow(
          instance(mockedInventoryService),
          eventPickSimpleSword.eventId,
          eventPickSimpleSword.actionableDefinition.name
        )
      ).thenReturn(simpleSword);

      const spy = spyOn(instance(mockedInventoryService), 'store');

      service.execute(actor, eventPickSimpleSword, {});

      expect(spy).toHaveBeenCalledWith(actor.id, simpleSword);
    });

    it('should react to the action', () => {
      when(
        mockedExtractorHelper.extractItemOrThrow(
          instance(mockedInventoryService),
          eventPickSimpleSword.eventId,
          eventPickSimpleSword.actionableDefinition.name
        )
      ).thenReturn(simpleSword);

      const spy = spyOn(instance(mockedAffectedAxiomService), 'affectWith');

      service.execute(actor, eventPickSimpleSword, {});

      expect(spy).toHaveBeenCalled();
    });
  });
});

const actor = instance(mockedPlayerEntity);

const eventPickSimpleSword = actionableEvent(
  actionPickSimpleSword,
  interactiveInfo.id
);
