import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { EquippedWidgetComponent } from './equipped.widget.component';

import { simpleSword } from '../../../../tests/fakes';

describe('EquippedWidgetComponent', () => {
  let component: EquippedWidgetComponent;
  let fixture: ComponentFixture<EquippedWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EquippedWidgetComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(EquippedWidgetComponent);

    component = fixture.componentInstance;

    component.item = simpleSword;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
