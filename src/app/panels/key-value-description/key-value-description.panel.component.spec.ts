import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { MaterialModule } from '../../../material/material.module';
import { KeyValueDescriptionPanelComponent } from './key-value-description.panel.component';
import { ArrayView } from '@wrappers/array.view';
import { KeyValueDescriptionView } from '../../view-models/key-value-description.view';

describe('KeyValueDescriptionPanelComponent', () => {
  let component: KeyValueDescriptionPanelComponent;
  let fixture: ComponentFixture<KeyValueDescriptionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KeyValueDescriptionPanelComponent],
      imports: [MaterialModule, NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KeyValueDescriptionPanelComponent);

    component = fixture.componentInstance;

    fixture.componentInstance.items = ArrayView.fromArray(characteristics());

    fixture.componentInstance.panelName = 'test';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have panel with key values`, () => {
    const widget = fixture.debugElement.query(
      By.css(`[data-testid="key-value-panel-test"]`)
    );

    expect(widget.children.length).toEqual(7);
  });
});

const characteristics = () => [
  KeyValueDescriptionView.create('STR', '10', 'The character physical force', 'characteristic'),
  KeyValueDescriptionView.create(
    'VIT',
    '12',
    'The character body constitution',
    'characteristic'
  ),
  KeyValueDescriptionView.create('SIZ', '11', 'The character body shape', 'characteristic'),
  KeyValueDescriptionView.create('AGI', '9', 'The character agility', 'characteristic'),
  KeyValueDescriptionView.create('INT', '13', 'The character intelligence', 'characteristic'),
  KeyValueDescriptionView.create('ESN', '14', 'The character essence', 'characteristic'),
  KeyValueDescriptionView.create('APP', '16', 'The character looks', 'characteristic'),
];
