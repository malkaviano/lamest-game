import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TravelPanelComponent } from './travel.panel.component';
import { InteractiveInterface } from '@interfaces/interactive.interface';
import { ArrayView } from '@wrappers/array.view';
import { createActionableDefinition } from '../../../../tests/fakes';

describe('TravelPanelComponent', () => {
  let component: TravelPanelComponent;
  let fixture: ComponentFixture<TravelPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TravelPanelComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TravelPanelComponent);
    component = fixture.componentInstance;
    component.panelName = 'travel-test';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide panel when no travel options available', () => {
    component.travels = ArrayView.empty();
    fixture.detectChanges();

    expect(component.hasTravelOptions).toBe(false);
    const panelElement = fixture.debugElement.nativeElement.querySelector(
      '[data-testid="travel-test"]'
    );
    expect(panelElement).toBeFalsy();
  });

  it('should show panel when travel options are available', () => {
    const travelInteractive = {
      id: 'travel-1',
      name: 'Exit Point',
      actions: ArrayView.create(
        createActionableDefinition('SCENE', 'exit', 'Exit')
      ),
    } as InteractiveInterface;

    component.travels = ArrayView.create(travelInteractive);
    fixture.detectChanges();

    expect(component.hasTravelOptions).toBe(true);
    const panelElement = fixture.debugElement.nativeElement.querySelector(
      '[data-testid="travel-test"]'
    );
    expect(panelElement).toBeTruthy();
  });

  it('should emit actionSelected event', () => {
    spyOn(component.actionSelected, 'emit');

    const mockEvent = {
      eventId: 'test',
      actionableDefinition: createActionableDefinition('SCENE', 'exit', 'Exit'),
    };
    component.onActionSelected(mockEvent);

    expect(component.actionSelected.emit).toHaveBeenCalledWith(mockEvent);
  });
});
