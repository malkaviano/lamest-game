import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatIconHarness } from '@angular/material/icon/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import { instance, mock, when } from 'ts-mockito';
import { of } from 'rxjs';

import { ActorsPanelComponent } from './actors.panel.component';
import { MaterialModule } from '../../../material/material.module';
import { ArrayView } from '@wrappers/array.view';
import { ActorEntity } from '@entities/actor.entity';
import { ActionableEvent } from '@events/actionable.event';
import { createActionableDefinition } from '@definitions/actionable.definition';

describe('ActorsPanelComponent', () => {
  let component: ActorsPanelComponent;
  let fixture: ComponentFixture<ActorsPanelComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActorsPanelComponent],
      imports: [MaterialModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ActorsPanelComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);

    component.panelName = 'actors';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when has actors', () => {
    beforeEach(() => {
      component.actors = ArrayView.create(
        instance(mockedActor1),
        instance(mockedActor2)
      );

      fixture.detectChanges();
    });

    it('should display panel', () => {
      const compiled = fixture.nativeElement;
      const panel = compiled.querySelector('.actors-panel');
      expect(panel).toBeTruthy();
    });

    it('should display panel title', () => {
      const compiled = fixture.nativeElement;
      const title = compiled.querySelector('.panel-title');
      expect(title.textContent).toContain('🤖 AI Actors');
    });

    it('should have correct data-testid attribute', () => {
      const compiled = fixture.nativeElement;
      const panel = compiled.querySelector('[data-testid="actors"]');
      expect(panel).toBeTruthy();
    });

    it('should render actor widgets for each actor', () => {
      const compiled = fixture.nativeElement;
      const widgets = compiled.querySelectorAll('app-actor-widget');
      expect(widgets.length).toBe(2);
    });

    it('should start expanded by default', () => {
      expect(component.isCollapsed).toBe(false);
      
      const compiled = fixture.nativeElement;
      const grid = compiled.querySelector('.actors-grid');
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
        
        expect(button.getAttribute('aria-label')).toBe('Collapse actors panel');

        const toggleButton = await loader.getHarness(MatButtonHarness.with({
          selector: '.collapse-toggle'
        }));
        await toggleButton.click();
        fixture.detectChanges();

        button = compiled.querySelector('.collapse-toggle');
        expect(button.getAttribute('aria-label')).toBe('Expand actors panel');
      });

      it('should add collapsed class to grid when collapsed', () => {
        component.toggleCollapse();
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        const grid = compiled.querySelector('.actors-grid');
        expect(grid.classList.contains('collapsed')).toBe(true);
      });
    });

    describe('action selection', () => {
      it('should emit actionSelected when actor widget emits event', () => {
        spyOn(component.actionSelected, 'emit');

        const testEvent = new ActionableEvent(testAction, 'actor1');
        const actorWidget = fixture.debugElement.query(
          By.css('app-actor-widget')
        );

        actorWidget.triggerEventHandler('actionSelected', testEvent);

        expect(component.actionSelected.emit).toHaveBeenCalledWith(testEvent);
      });

      it('should call onActionSelected method when event is triggered', () => {
        spyOn(component, 'onActionSelected');

        const testEvent = new ActionableEvent(testAction, 'actor1');
        const actorWidget = fixture.debugElement.query(
          By.css('app-actor-widget')
        );

        actorWidget.triggerEventHandler('actionSelected', testEvent);

        expect(component.onActionSelected).toHaveBeenCalledWith(testEvent);
      });
    });

    describe('hasActors getter', () => {
      it('should return true when actors array has items', () => {
        expect(component.hasActors).toBe(true);
      });
    });
  });

  describe('when has no actors', () => {
    beforeEach(() => {
      component.actors = ArrayView.create();
      fixture.detectChanges();
    });

    it('should not display panel', () => {
      const compiled = fixture.nativeElement;
      const panel = compiled.querySelector('.actors-panel');
      expect(panel).toBeFalsy();
    });

    it('should return false for hasActors', () => {
      expect(component.hasActors).toBe(false);
    });

    it('should not render any actor widgets', () => {
      const compiled = fixture.nativeElement;
      const widgets = compiled.querySelectorAll('app-actor-widget');
      expect(widgets.length).toBe(0);
    });
  });

  describe('panel name input', () => {
    it('should use panelName for data-testid', () => {
      component.panelName = 'custom-actors';
      component.actors = ArrayView.create(instance(mockedActor1));
      
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const panel = compiled.querySelector('[data-testid="custom-actors"]');
      expect(panel).toBeTruthy();
    });
  });
});

// Mock actors
const mockedActor1 = mock(ActorEntity);
const mockedActor2 = mock(ActorEntity);

when(mockedActor1.id).thenReturn('actor1');
when(mockedActor1.name).thenReturn('Orc Warrior');
when(mockedActor1.description).thenReturn('A fierce orc warrior ready for battle');
when(mockedActor1.classification).thenReturn('ACTOR');
when(mockedActor1.behavior).thenReturn('AGGRESSIVE');
when(mockedActor1.situation).thenReturn('ALIVE');
when(mockedActor1.visibility).thenReturn('VISIBLE');
when(mockedActor1.actions).thenReturn(
  ArrayView.create(createActionableDefinition('AFFECT', 'attack', 'Attack'))
);
when(mockedActor1.actionsChanged$).thenReturn(of(ArrayView.create(
  createActionableDefinition('AFFECT', 'attack', 'Attack')
)));
when(mockedActor1.ignores).thenReturn(ArrayView.create());

when(mockedActor2.id).thenReturn('actor2');
when(mockedActor2.name).thenReturn('Goblin Rogue');
when(mockedActor2.description).thenReturn('A sneaky goblin with daggers');
when(mockedActor2.classification).thenReturn('ACTOR');
when(mockedActor2.behavior).thenReturn('RETALIATE');
when(mockedActor2.situation).thenReturn('ALIVE');
when(mockedActor2.visibility).thenReturn('HIDDEN');
when(mockedActor2.actions).thenReturn(
  ArrayView.create(createActionableDefinition('SKILL', 'stealth', 'Stealth'))
);
when(mockedActor2.actionsChanged$).thenReturn(of(ArrayView.create(
  createActionableDefinition('SKILL', 'stealth', 'Stealth')
)));
when(mockedActor2.ignores).thenReturn(ArrayView.create('DISGUISED'));

const testAction = createActionableDefinition('AFFECT', 'attack', 'Attack');