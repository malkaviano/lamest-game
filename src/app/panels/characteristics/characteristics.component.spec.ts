import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { MaterialModule } from '../../../material/material.module';
import { CharacteristicsComponent } from './characteristics.component';
import { Characteristic } from '../../definitions/characteristic.definition';

describe('CharacteristicsComponent', () => {
  let component: CharacteristicsComponent;
  let fixture: ComponentFixture<CharacteristicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharacteristicsComponent],
      imports: [MaterialModule, NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacteristicsComponent);

    component = fixture.componentInstance;

    fixture.componentInstance.characteristics = characteristics();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  ['STR', 'CON', 'SIZ', 'DEX', 'INT', 'POW', 'APP'].forEach((name) => {
    it(`should have ${name} panel`, () => {
      const widget = fixture.debugElement.query(
        By.css(`[data-testid="${name}"]`)
      );

      expect(widget).not.toBeNull();
    });
  });
});

const characteristics = () => [
  new Characteristic('STR', 10, 'The character physical force'),
  new Characteristic('CON', 12, 'The character body constitution'),
  new Characteristic('SIZ', 11, 'The character body shape'),
  new Characteristic('DEX', 9, 'The character agility'),
  new Characteristic('INT', 13, 'The character intelligence'),
  new Characteristic('POW', 14, 'The character mental strength'),
  new Characteristic('APP', 16, 'The character looks'),
];
