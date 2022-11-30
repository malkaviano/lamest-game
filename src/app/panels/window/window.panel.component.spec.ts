import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { MaterialModule } from '../../../material/material.module';
import { WindowPanelComponent } from './window.panel.component';
import { KeyValueDescriptionDefinition } from '../../definitions/key-value-description.definition';

describe('WindowPanelComponent', () => {
  let fixture: ComponentFixture<WindowPanelComponent>;
  let component: WindowPanelComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WindowPanelComponent],
      imports: [MaterialModule, NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WindowPanelComponent);

    fixture.componentInstance.keyValue = characteristic('STR', '8', 'Strength');

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  it('should have name', async () => {
    const input = fixture.debugElement.query(By.css('[data-testid="key-STR"]'));

    expect(input.nativeElement.innerHTML).toEqual('STR');
  });

  it('should have value', async () => {
    const input = fixture.debugElement.query(
      By.css('[data-testid="value-STR"]')
    );

    expect(input.nativeElement.innerHTML).toEqual('8');
  });
});

const characteristic = (name: string, value: string, description: string) =>
  new KeyValueDescriptionDefinition(name, value, description);
