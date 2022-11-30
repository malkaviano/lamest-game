import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractivePanelComponent } from './interactive.panel.component';

describe('InteractivePanelComponent', () => {
  let component: InteractivePanelComponent;
  let fixture: ComponentFixture<InteractivePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InteractivePanelComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InteractivePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
