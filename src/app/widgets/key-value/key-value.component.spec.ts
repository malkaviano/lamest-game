import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { MaterialModule } from '../../../material/material.module';
import { KeyValueComponent } from './key-value.component';
import { KeyValueDescription } from '../../definitions/key-value-description.definition';

describe('KeyValueComponent', () => {
  let fixture: ComponentFixture<KeyValueComponent>;
  let component: KeyValueComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KeyValueComponent],
      imports: [MaterialModule, NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KeyValueComponent);

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
  new KeyValueDescription(name, value, description);
