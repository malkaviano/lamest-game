import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatIconHarness } from '@angular/material/icon/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import { instance, mock, when } from 'ts-mockito';
import { of } from 'rxjs';

import { ReactivesPanelComponent } from './reactives.panel.component';
import { MaterialModule } from '../../../material/material.module';
import { ArrayView } from '@wrappers/array.view';
import { InteractiveEntity } from '@entities/interactive.entity';
import { ActionableEvent } from '@events/actionable.event';
import { createActionableDefinition } from '@definitions/actionable.definition';

describe('ReactivesPanelComponent', () => {
  let component: ReactivesPanelComponent;
  let fixture: ComponentFixture<ReactivesPanelComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReactivesPanelComponent],
      imports: [MaterialModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ReactivesPanelComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);

    component.panelName = 'reactives';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when has reactives', () => {
    beforeEach(() => {
      component.reactives = ArrayView.create(
        instance(mockedReactive1),
        instance(mockedReactive2)
      );

      fixture.detectChanges();
    });

    it('should display panel', () => {
      const compiled = fixture.nativeElement;
      const panel = compiled.querySelector('.reactives-panel');
      expect(panel).toBeTruthy();
    });

    it('should display panel title', () => {
      const compiled = fixture.nativeElement;
      const title = compiled.querySelector('.panel-title');
      expect(title.textContent).toContain('⚙️ Objects & Items');
    });

    it('should have correct data-testid attribute', () => {
      const compiled = fixture.nativeElement;
      const panel = compiled.querySelector('[data-testid="reactives"]');
      expect(panel).toBeTruthy();
    });

    it('should render reactive widgets for each reactive', () => {
      const compiled = fixture.nativeElement;
      const widgets = compiled.querySelectorAll('app-reactive-widget');
      expect(widgets.length).toBe(2);
    });

    it('should start expanded by default', () => {
      expect(component.isCollapsed).toBe(false);
      
      const compiled = fixture.nativeElement;
      const grid = compiled.querySelector('.reactives-grid');
      expect(grid.classList.contains('collapsed')).toBe(false);
    });

    describe('collapse functionality', () => {
      it('should toggle collapse state when button is clicked', async () => {
        const toggleButton = await loader.getHarness(MatButtonHarness.with({
          selector: '.collapse-toggle'
        }));

        expect(component.isCollapsed).toBe(false);
        
        await toggleButton.click();
        
        expect(component.isCollapsed).toBe(true);
        
        await toggleButton.click();
        
        expect(component.isCollapsed).toBe(false);
      });

      it('should update icon when collapsed/expanded', async () => {
        fixture.detectChanges();
        
        let icon = await loader.getHarness(MatIconHarness);
        expect(await icon.getName()).toBe('expand_less');

        component.toggleCollapse();
        fixture.detectChanges();

        icon = await loader.getHarness(MatIconHarness);
        expect(await icon.getName()).toBe('expand_more');
      });

      it('should update aria-label when collapsed/expanded', async () => {
        const compiled = fixture.nativeElement;
        let button = compiled.querySelector('.collapse-toggle');
        
        expect(button.getAttribute('aria-label')).toBe('Collapse objects panel');

        const toggleButton = await loader.getHarness(MatButtonHarness.with({
          selector: '.collapse-toggle'
        }));
        await toggleButton.click();
        fixture.detectChanges();

        button = compiled.querySelector('.collapse-toggle');
        expect(button.getAttribute('aria-label')).toBe('Expand objects panel');
      });


      it('should add collapsed class to grid when collapsed', () => {
        component.toggleCollapse();
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        const grid = compiled.querySelector('.reactives-grid');
        expect(grid.classList.contains('collapsed')).toBe(true);
      });
    });

    describe('action selection', () => {
      it('should emit actionSelected when reactive widget emits event', () => {
        spyOn(component.actionSelected, 'emit');

        const testEvent = new ActionableEvent(testAction, 'reactive1');
        const reactiveWidget = fixture.debugElement.query(
          By.css('app-reactive-widget')
        );

        reactiveWidget.triggerEventHandler('actionSelected', testEvent);

        expect(component.actionSelected.emit).toHaveBeenCalledWith(testEvent);
      });

      it('should call onActionSelected method when event is triggered', () => {
        spyOn(component, 'onActionSelected');

        const testEvent = new ActionableEvent(testAction, 'reactive1');
        const reactiveWidget = fixture.debugElement.query(
          By.css('app-reactive-widget')
        );

        reactiveWidget.triggerEventHandler('actionSelected', testEvent);

        expect(component.onActionSelected).toHaveBeenCalledWith(testEvent);
      });
    });

    describe('hasReactives getter', () => {
      it('should return true when reactives array has items', () => {
        expect(component.hasReactives).toBe(true);
      });
    });
  });

  describe('when has no reactives', () => {
    beforeEach(() => {
      component.reactives = ArrayView.create();
      fixture.detectChanges();
    });

    it('should not display panel', () => {
      const compiled = fixture.nativeElement;
      const panel = compiled.querySelector('.reactives-panel');
      expect(panel).toBeFalsy();
    });

    it('should return false for hasReactives', () => {
      expect(component.hasReactives).toBe(false);
    });

    it('should not render any reactive widgets', () => {
      const compiled = fixture.nativeElement;
      const widgets = compiled.querySelectorAll('app-reactive-widget');
      expect(widgets.length).toBe(0);
    });
  });

  describe('panel name input', () => {
    it('should use panelName for data-testid', () => {
      component.panelName = 'custom-reactives';
      component.reactives = ArrayView.create(instance(mockedReactive1));
      
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const panel = compiled.querySelector('[data-testid="custom-reactives"]');
      expect(panel).toBeTruthy();
    });
  });
});

// Mock reactives
const mockedReactive1 = mock(InteractiveEntity);
const mockedReactive2 = mock(InteractiveEntity);

when(mockedReactive1.id).thenReturn('reactive1');
when(mockedReactive1.name).thenReturn('Trapped Chest');
when(mockedReactive1.description).thenReturn('A chest that reacts to movement');
when(mockedReactive1.classification).thenReturn('REACTIVE');
when(mockedReactive1.actions).thenReturn(
  ArrayView.create(createActionableDefinition('SKILL', 'disarm', 'Disarm'))
);
when(mockedReactive1.actionsChanged$).thenReturn(of(ArrayView.create(
  createActionableDefinition('SKILL', 'disarm', 'Disarm')
)));

when(mockedReactive2.id).thenReturn('reactive2');
when(mockedReactive2.name).thenReturn('Pressure Plate');
when(mockedReactive2.description).thenReturn('A plate that responds to pressure');
when(mockedReactive2.classification).thenReturn('REACTIVE');
when(mockedReactive2.actions).thenReturn(
  ArrayView.create(createActionableDefinition('INTERACTION', 'trigger', 'Trigger'))
);
when(mockedReactive2.actionsChanged$).thenReturn(of(ArrayView.create(
  createActionableDefinition('INTERACTION', 'trigger', 'Trigger')
)));

const testAction = createActionableDefinition('SKILL', 'disarm', 'Disarm');