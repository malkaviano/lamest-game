import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from '../../../material/material.module';
import { CharacterPageComponent } from './character-page.component';

describe('CharacterPageComponent', () => {
  let component: CharacterPageComponent;
  let fixture: ComponentFixture<CharacterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharacterPageComponent],
      imports: [MaterialModule, NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have characteristics', () => {
    expect(component.characteristicsView.keyValues.length).toBe(7);
  });

  it('should have identity', () => {
    expect(component.identityView.keyValues.length).toBe(7);
  });

  it('should have attributes', () => {
    expect(component.derivedAttributesView.keyValues.length).toBe(3);
  });
});
