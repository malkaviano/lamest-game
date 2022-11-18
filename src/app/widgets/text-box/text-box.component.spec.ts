import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TextBoxComponent } from './text-box.component';

describe('TextBoxComponent', () => {
  let component: TextBoxComponent;
  let fixture: ComponentFixture<TextBoxComponent>;
  let paragraphs = ['p1', 'p2', 'p3', 'p4'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextBoxComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TextBoxComponent);
    component = fixture.componentInstance;

    fixture.componentInstance.paragraphs = paragraphs;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 4 paragraphs', () => {
    const result = fixture.debugElement
      .queryAll(By.css('.text-box p'))
      .map((e) => e.nativeElement);

    expect(result.length).toEqual(4);
  });
});
