import { TestBed } from '@angular/core/testing';

import { deepEqual, instance, when } from 'ts-mockito';

import { InventoryService } from '../services/inventory.service';
import { PickRule } from './pick.rule';
import { CheckedHelper } from '../helpers/checked.helper';
import { AffectAxiom } from '../axioms/affect.axiom';

import {
  mockedAffectedAxiomService,
  mockedCheckedHelper,
  mockedInteractiveEntity,
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
          useValue: instance(mockedCheckedHelper),
        },
        {
          provide: AffectAxiom,
          useValue: instance(mockedAffectedAxiomService),
        },
      ],
    });

    setupMocks();

    when(
      mockedCheckedHelper.takeItemOrThrow(
        instance(mockedInventoryService),
        eventPickSimpleSword.eventId,
        eventPickSimpleSword.actionableDefinition.name
      )
    ).thenReturn(simpleSword);

    when(
      mockedCheckedHelper.getRuleTargetOrThrow(
        deepEqual({ target: instance(mockedInteractiveEntity) })
      )
    ).thenReturn(instance(mockedInteractiveEntity));

    service = TestBed.inject(PickRule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    it('should store the item', () => {
      const spy = spyOn(instance(mockedInventoryService), 'store');

      service.execute(actor, eventPickSimpleSword, {
        target: instance(mockedInteractiveEntity),
      });

      expect(spy).toHaveBeenCalledWith(actor.id, simpleSword);
    });

    it('should react to the action', () => {
      const spy = spyOn(instance(mockedAffectedAxiomService), 'affectWith');

      service.execute(actor, eventPickSimpleSword, {
        target: instance(mockedInteractiveEntity),
      });

      expect(spy).toHaveBeenCalled();
    });
  });
});

const actor = instance(mockedPlayerEntity);

const eventPickSimpleSword = actionableEvent(
  actionPickSimpleSword,
  interactiveInfo.id
);
