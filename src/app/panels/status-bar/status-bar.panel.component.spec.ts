import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusBarPanelComponent } from './status-bar.panel.component';

import { fakeCharacterStatusView } from '../../../../tests/fakes';

describe('StatusBarPanelComponent', () => {
  let component: StatusBarPanelComponent;
  let fixture: ComponentFixture<StatusBarPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusBarPanelComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusBarPanelComponent);
    component = fixture.componentInstance;

    component.status = fakeCharacterStatusView;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
