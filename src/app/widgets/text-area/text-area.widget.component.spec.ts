import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TextAreaWidgetComponent } from './text-area.widget.component';
import { ArrayView } from '@conceptual/view-models/array.view';

describe('TextAreaWidgetComponent', () => {
  let component: TextAreaWidgetComponent;
  let fixture: ComponentFixture<TextAreaWidgetComponent>;
  const paragraphs = ArrayView.create('p1', 'p2', 'p3', 'p4');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextAreaWidgetComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TextAreaWidgetComponent);
    component = fixture.componentInstance;

    fixture.componentInstance.paragraphs = paragraphs;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 4 paragraphs', () => {
    const result = fixture.debugElement
      .queryAll(By.css('[data-testid="text-area-paragraph"]'))
      .map((e) => e.nativeElement);

    expect(result.length).toEqual(4);
  });
});
