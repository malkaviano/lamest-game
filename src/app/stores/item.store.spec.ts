import { TestBed } from '@angular/core/testing';

import { anything, instance, when } from 'ts-mockito';

import { createDice } from '../definitions/dice.definition';
import { ConverterHelper } from '../helpers/converter.helper';
import { ItemStore } from './item.store';
import { ResourcesStore } from './resources.store';

import {
  mockedConverterHelper,
  mockedResourcesStore,
  setupMocks,
} from '../../../tests/mocks';

describe('ItemStore', () => {
  let service: ItemStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ConverterHelper,
          useValue: instance(mockedConverterHelper),
        },
        {
          provide: ResourcesStore,
          useValue: instance(mockedResourcesStore),
        },
      ],
    });

    setupMocks();

    when(mockedConverterHelper.mapToKeyValueInterface(anything())).thenReturn({
      knife: {
        identity: {
          name: 'knife',
          label: 'Hunting Knife',
          description: 'gg',
        },
        dodgeable: true,
        skillName: 'Melee Weapon (Simple)',
        damage: {
          dice: createDice(),
          fixed: 1,
        },
      },
      bubbleGum: {
        identity: {
          name: 'bubbleGum',
          label: 'Bubble Gum',
          description: 'gg',
        },
      },
    });

    service = TestBed.inject(ItemStore);
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  describe('itemSkill', () => {
    describe('when item had skill requirement', () => {
      it('return skill name', () => {
        const result = service.itemSkill('knife');

        expect(result).toEqual('Melee Weapon (Simple)');
      });
    });

    describe('when item did not have skill requirement', () => {
      it('return skill name', () => {
        const result = service.itemSkill('bubbleGum');

        expect(result).toBeNull();
      });
    });
  });

  describe('itemLabel', () => {
    it('return item label', () => {
      const result = service.itemLabel('knife');

      expect(result).toEqual('Hunting Knife');
    });
  });
});
