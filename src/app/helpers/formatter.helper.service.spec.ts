import { TestBed } from '@angular/core/testing';

import { instance, when } from 'ts-mockito';

import { FormatterHelperService } from './formatter.helper.service';
import { SkillStore } from '../../stores/skill.store';

import {
  fakeCharacteristics,
  fakeCharacterSheet,
  fakeDerivedAttributes,
  fakeIdentity,
  fakeSkills,
} from '../../../tests/fakes';
import {
  mockedPlayerEntity,
  mockedSkillStore,
  setupMocks,
} from '../../../tests/mocks';

describe('FormatterHelperService', () => {
  let service: FormatterHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SkillStore, useValue: instance(mockedSkillStore) },
      ],
    });

    setupMocks();

    service = TestBed.inject(FormatterHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('converting a character to keyValues', () => {
    it('return keyvalue array', () => {
      when(mockedPlayerEntity.identity).thenReturn(fakeIdentity);

      when(mockedPlayerEntity.characteristics).thenReturn(fakeCharacteristics);

      when(mockedPlayerEntity.derivedAttributes).thenReturn(
        fakeDerivedAttributes
      );

      when(mockedPlayerEntity.skills).thenReturn(fakeSkills);

      const result = service.characterToKeyValueDescription(
        instance(mockedPlayerEntity)
      );

      expect(result).toEqual(fakeCharacterSheet);
    });
  });
});
