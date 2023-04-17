import { TestBed } from '@angular/core/testing';

import { anything, instance, when } from 'ts-mockito';

import { createDice } from '../../core/definitions/dice.definition';
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
          description: 'Knife used for hunting',
        },
        dodgeable: true,
        skillName: 'Melee Weapon (Simple)',
        damage: {
          dice: createDice(),
          fixed: 1,
        },
      },
      analgesic: {
        identity: {
          name: 'analgesic',
          label: 'Analgesic',
          description: 'recover 1 HP and 1 Energy',
        },
      },
    });

    service = TestBed.inject(ItemStore);
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });
});
