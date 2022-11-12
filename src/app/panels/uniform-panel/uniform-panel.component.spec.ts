import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { MaterialModule } from '../../../material/material.module';
import { UniformPanelComponent } from './uniform-panel.component';
import { KeyValueDescription } from '../../definitions/key-value-description.definition';

describe('UniformPanelComponent', () => {
  let component: UniformPanelComponent;
  let fixture: ComponentFixture<UniformPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UniformPanelComponent],
      imports: [MaterialModule, NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UniformPanelComponent);

    component = fixture.componentInstance;

    fixture.componentInstance.keyValues = characteristics();

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
  new KeyValueDescription('STR', '10', 'The character physical force'),
  new KeyValueDescription('CON', '12', 'The character body constitution'),
  new KeyValueDescription('SIZ', '11', 'The character body shape'),
  new KeyValueDescription('DEX', '9', 'The character agility'),
  new KeyValueDescription('INT', '13', 'The character intelligence'),
  new KeyValueDescription('POW', '14', 'The character mental strength'),
  new KeyValueDescription('APP', '16', 'The character looks'),
];
