import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TextAreaPanelComponent } from './text-area.panel.component';
import { ArrayView } from '../../model-views/array.view';

describe('TextAreaPanelComponent', () => {
  let component: TextAreaPanelComponent;
  let fixture: ComponentFixture<TextAreaPanelComponent>;
  const paragraphs = ArrayView.create(['p1', 'p2', 'p3', 'p4']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextAreaPanelComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TextAreaPanelComponent);
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
