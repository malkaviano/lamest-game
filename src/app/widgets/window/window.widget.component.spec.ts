import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { MaterialModule } from '../../../material/material.module';
import { WindowWidgetComponent } from './window.widget.component';
import { KeyValueDescriptionView } from '../../../core/view-models/key-value-description.view';

describe('WindowWidgetComponent', () => {
  let fixture: ComponentFixture<WindowWidgetComponent>;
  let component: WindowWidgetComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WindowWidgetComponent],
      imports: [MaterialModule, NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WindowWidgetComponent);

    fixture.componentInstance.keyValue = characteristic('STR', '8', 'Strength');

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  it('should have name', async () => {
    const input = fixture.debugElement.query(By.css('[data-testid="key-STR"]'));

    expect(input.nativeElement.innerHTML).toEqual('Str');
  });

  it('should have value', async () => {
    const input = fixture.debugElement.query(
      By.css('[data-testid="value-STR"]')
    );

    expect(input.nativeElement.innerHTML).toEqual('8');
  });
});

const characteristic = (name: string, value: string, description: string) =>
  KeyValueDescriptionView.create(name, value, description);
