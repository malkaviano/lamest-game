import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { MainTextComponent } from './main-text.component';

describe('MainTextComponent', () => {
  let component: MainTextComponent;
  let fixture: ComponentFixture<MainTextComponent>;
  let paragraphs = ['p1', 'p2', 'p3', 'p4'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainTextComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MainTextComponent);
    component = fixture.componentInstance;

    fixture.componentInstance.paragraphs = paragraphs;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 4 paragraphs', () => {
    const result = fixture.debugElement
      .queryAll(By.css('.main-text p'))
      .map((e) => e.nativeElement);

    expect(result.length).toEqual(4);
  });
});
