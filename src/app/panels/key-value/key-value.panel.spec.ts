import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { MaterialModule } from '../../../material/material.module';
import { KeyValuePanel } from './key-value.panel';
import { KeyValueDescriptionDefinition } from '../../definitions/key-value-description.definition';

describe('KeyValuePanel', () => {
  let component: KeyValuePanel;
  let fixture: ComponentFixture<KeyValuePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KeyValuePanel],
      imports: [MaterialModule, NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KeyValuePanel);

    component = fixture.componentInstance;

    fixture.componentInstance.keyValues = characteristics();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have panel with key values`, () => {
    const widget = fixture.debugElement.query(
      By.css(`[data-testid="key-value-panel"]`)
    );

    expect(widget.children.length).toEqual(7);
  });
});

const characteristics = () => [
  new KeyValueDescriptionDefinition(
    'STR',
    '10',
    'The character physical force'
  ),
  new KeyValueDescriptionDefinition(
    'CON',
    '12',
    'The character body constitution'
  ),
  new KeyValueDescriptionDefinition('SIZ', '11', 'The character body shape'),
  new KeyValueDescriptionDefinition('DEX', '9', 'The character agility'),
  new KeyValueDescriptionDefinition('INT', '13', 'The character intelligence'),
  new KeyValueDescriptionDefinition(
    'POW',
    '14',
    'The character mental strength'
  ),
  new KeyValueDescriptionDefinition('APP', '16', 'The character looks'),
];