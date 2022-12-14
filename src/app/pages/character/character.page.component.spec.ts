import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { instance } from 'ts-mockito';

import { MaterialModule } from '../../../material/material.module';
import { FormatterHelperService } from '../../helpers/formatter.helper.service';
import { CharacterPageComponent } from './character.page.component';
import { CharacterService } from '../../services/character.service';

import {
  mockedCharacterService,
  mockedFormatterHelperService,
  setupMocks,
} from '../../../../tests/mocks';

describe('CharacterPageComponent', () => {
  let component: CharacterPageComponent;
  let fixture: ComponentFixture<CharacterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharacterPageComponent],
      imports: [MaterialModule, NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: CharacterService,
          useValue: instance(mockedCharacterService),
        },
        {
          provide: FormatterHelperService,
          useValue: instance(mockedFormatterHelperService),
        },
      ],
    }).compileComponents();

    setupMocks();

    fixture = TestBed.createComponent(CharacterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have characteristics', () => {
    expect(component.characteristicsView.items.length).toBe(6);
  });

  it('should have identity', () => {
    expect(component.identityView.items.length).toBe(6);
  });

  it('should have attributes', () => {
    expect(component.derivedAttributesView.items.length).toBe(3);
  });
});
