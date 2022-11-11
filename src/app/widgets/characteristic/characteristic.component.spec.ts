import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { MaterialModule } from '../../../material/material.module';
import { CharacteristicComponent } from './characteristic.component';
import { Characteristic } from '../../definitions/characteristic.definition';

describe('CharacteristicComponent', () => {
  let fixture: ComponentFixture<CharacteristicComponent>;
  let component: CharacteristicComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharacteristicComponent],
      imports: [MaterialModule, NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacteristicComponent);

    fixture.componentInstance.characteristic = characteristic(
      'STR',
      8,
      'Strength'
    );

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  it('should have name', async () => {
    const input = fixture.debugElement.query(
      By.css('[data-testid="name-STR"]')
    );

    expect(input.nativeElement.innerHTML).toEqual('STR');
  });

  it('should have description', async () => {
    const input = fixture.debugElement.query(
      By.css('[data-testid="description-STR"]')
    );

    expect(input.nativeElement.innerHTML).toEqual('Strength');
  });

  it('should have value', async () => {
    const input = fixture.debugElement.query(
      By.css('[data-testid="value-STR"]')
    );

    expect(input.nativeElement.innerHTML).toEqual('8');
  });
});

const characteristic = (name: string, value: number, description: string) =>
  new Characteristic(name, value, description);
