import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TravelWidgetComponent } from './travel.widget.component';
import { InteractiveInterface } from '@interfaces/interactive.interface';
import { ArrayView } from '@wrappers/array.view';
import { createActionableDefinition } from '../../../../tests/fakes';

describe('TravelWidgetComponent', () => {
  let component: TravelWidgetComponent;
  let fixture: ComponentFixture<TravelWidgetComponent>;
  let mockInteractive: InteractiveInterface;

  beforeEach(async () => {
    const sceneAction = createActionableDefinition(
      'SCENE',
      'exit',
      'Exit to Town'
    );

    mockInteractive = {
      id: 'test-travel',
      name: 'Forest Exit',
      description: 'A path leading back to town',
      actions: ArrayView.create(sceneAction),
      ignores: ArrayView.empty(),
      behavior: 'PASSIVE',
      classification: 'REACTIVE',
      visibility: 'VISIBLE',
    } as InteractiveInterface;

    await TestBed.configureTestingModule({
      imports: [MatButtonModule, MatTooltipModule],
      declarations: [TravelWidgetComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TravelWidgetComponent);
    component = fixture.componentInstance;
    component.interactive = mockInteractive;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show travel card when interactive has scene actions', () => {
    expect(component.hasSceneActions).toBe(true);

    const cardElement = fixture.debugElement.nativeElement.querySelector(
      '[data-testid="travel-test-travel"]'
    );
    expect(cardElement).toBeTruthy();
  });

  it('should display interactive name and description', () => {
    const nameElement =
      fixture.debugElement.nativeElement.querySelector('.travel-name');
    expect(nameElement.textContent.trim()).toBe('Forest Exit');
  });

  it('should emit actionSelected when travel button is clicked', () => {
    const spy = spyOn(component.actionSelected, 'emit');

    const button = fixture.debugElement.nativeElement.querySelector(
      '[data-testid="travel-action-exit"]'
    );
    button.click();

    expect(spy).toHaveBeenCalledTimes(1);
    const emittedEvent = spy.calls.argsFor(0)[0];
    expect(emittedEvent?.eventId).toBe('test-travel');
    expect(emittedEvent?.actionableDefinition.name).toBe('exit');
  });

  it('should filter only scene actions', () => {
    const skillAction = createActionableDefinition(
      'SKILL',
      'perception',
      'Perception Check'
    );
    const sceneAction = createActionableDefinition('SCENE', 'exit', 'Exit');

    const mixedInteractive = {
      ...mockInteractive,
      actions: ArrayView.create(skillAction, sceneAction),
    };

    component.interactive = mixedInteractive;

    expect(component.actions.items.length).toBe(1);
    expect(component.actions.items[0].actionable).toBe('SCENE');
  });
});
