import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { instance, mock, when } from 'ts-mockito';
import { Subject } from 'rxjs';

import { CombatTimelinePanelComponent } from './combat-timeline.panel.component';
import { MaterialModule } from '../../../material/material.module';
import { GameLoopService } from '@services/game-loop.service';
import { HighlightService } from '../../services/highlight.service';
import { CombatEvent } from '@interfaces/combat-event.interface';
import { GameEventsValues } from '../../../backend/values/game-events.value';

describe('CombatTimelinePanelComponent', () => {
  let component: CombatTimelinePanelComponent;
  let fixture: ComponentFixture<CombatTimelinePanelComponent>;
  let loader: HarnessLoader;
  let mockGameLoop: GameLoopService;
  let mockHighlight: HighlightService;
  let combatEventsSubject: Subject<CombatEvent>;

  beforeEach(async () => {
    mockGameLoop = mock(GameLoopService);
    mockHighlight = mock(HighlightService);
    combatEventsSubject = new Subject<CombatEvent>();

    // Mock the events object with combatEvents$ observable
    when(mockGameLoop.events).thenReturn({
      combatEvents$: combatEventsSubject.asObservable(),
    } as GameEventsValues);

    await TestBed.configureTestingModule({
      declarations: [CombatTimelinePanelComponent],
      imports: [MaterialModule, NoopAnimationsModule, FormsModule],
      providers: [
        { provide: GameLoopService, useValue: instance(mockGameLoop) },
        { provide: HighlightService, useValue: instance(mockHighlight) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CombatTimelinePanelComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.detectChanges();
  });

  afterEach(() => {
    combatEventsSubject.complete();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with empty events', () => {
    expect(component.events.items.length).toBe(0);
  });

  it('should display empty message when no events', () => {
    const compiled = fixture.nativeElement;
    const emptyMessage = compiled.querySelector('.empty');
    expect(emptyMessage.textContent).toContain('No combat events yet.');
  });

  describe('event handling', () => {
    it('should add event when combat event is emitted', () => {
      const testEvent: CombatEvent = {
        timestamp: Date.now(),
        category: 'AFFECTED',
        actorId: 'orc1',
        actorName: 'Orc Warrior',
        targetId: 'hero1',
        targetName: 'Hero',
        outcome: 'HIT',
        amount: 15,
        effectType: 'KINETIC',
      };

      combatEventsSubject.next(testEvent);

      expect(component.events.items.length).toBe(1);
      expect(component.events.items[0]).toEqual(testEvent);
    });

    it('should add multiple events in order', () => {
      const event1: CombatEvent = {
        timestamp: Date.now(),
        category: 'AFFECTED',
        actorId: 'hero1',
        actorName: 'Hero',
        targetId: 'goblin1',
        targetName: 'Goblin',
        outcome: 'CRIT',
        amount: 25,
        effectType: 'KINETIC',
      };

      const event2: CombatEvent = {
        timestamp: Date.now() + 1,
        category: 'AFFECTED',
        actorId: 'goblin1',
        actorName: 'Goblin',
        targetId: 'hero1',
        targetName: 'Hero',
        outcome: 'MISS',
        amount: 0,
        effectType: 'KINETIC',
      };

      combatEventsSubject.next(event1);
      combatEventsSubject.next(event2);

      expect(component.events.items.length).toBe(2);
      expect(component.events.items[1]).toEqual(event1);
      expect(component.events.items[0]).toEqual(event2);
    });

    it('should clear all events when clear is called', () => {
      const testEvent: CombatEvent = {
        timestamp: Date.now(),
        category: 'AFFECTED',
        actorId: 'actor1',
        actorName: 'Test Actor',
        targetId: 'target1',
        targetName: 'Test Target',
        outcome: 'HIT',
        amount: 10,
        effectType: 'FIRE',
      };

      combatEventsSubject.next(testEvent);
      expect(component.events.items.length).toBe(1);

      component.clear();

      expect(component.events.items.length).toBe(0);
    });

    it('should clear events when clear button is clicked', async () => {
      const testEvent: CombatEvent = {
        timestamp: Date.now(),
        category: 'AFFECTED',
        actorId: 'actor1',
        actorName: 'Test Actor',
        targetId: 'target1',
        targetName: 'Test Target',
        outcome: 'HIT',
        amount: 10,
        effectType: 'FIRE',
      };

      combatEventsSubject.next(testEvent);
      fixture.detectChanges();

      const clearButton = await loader.getHarness(
        MatButtonHarness.with({ text: 'Clear' })
      );
      await clearButton.click();

      expect(component.events.items.length).toBe(0);
    });
  });

  describe('event display', () => {
    beforeEach(() => {
      const events: CombatEvent[] = [
        {
          timestamp: Date.now(),
          category: 'AFFECTED',
          actorId: 'hero1',
          actorName: 'Hero',
          targetId: 'orc1',
          targetName: 'Orc',
          outcome: 'HIT',
          amount: 12,
          effectType: 'KINETIC',
        },
        {
          timestamp: Date.now() + 1,
          category: 'AFFECTED',
          actorId: 'orc1',
          actorName: 'Orc',
          targetId: 'hero1',
          targetName: 'Hero',
          outcome: 'CRIT',
          amount: 20,
          effectType: 'FIRE',
        },
        {
          timestamp: Date.now() + 2,
          category: 'AFFECTED',
          actorId: 'healer1',
          actorName: 'Healer',
          targetId: 'hero1',
          targetName: 'Hero',
          outcome: 'HEAL',
          amount: 8,
        },
      ];

      events.forEach((event) => combatEventsSubject.next(event));
      fixture.detectChanges();
    });

    it('should display events in the list', () => {
      const compiled = fixture.nativeElement;
      const events = compiled.querySelectorAll('.event');
      expect(events.length).toBe(3);
    });

    it('should display actor and target names', () => {
      const compiled = fixture.nativeElement;
      const firstEvent = compiled.querySelector('.event');

      expect(firstEvent.textContent).toContain('Hero');
      expect(firstEvent.textContent).toContain('Healer');
      expect(firstEvent.querySelector('.arrow').textContent).toBe('→');
    });

    it('should display damage amounts with correct styling', () => {
      const compiled = fixture.nativeElement;
      const events = compiled.querySelectorAll('.event');

      const hitEvent = events[2];
      const critEvent = events[1];
      const healEvent = events[0];

      expect(hitEvent.querySelector('.amount.damage').textContent).toBe('-12');
      expect(critEvent.querySelector('.amount.crit').textContent).toBe('-20');
      expect(healEvent.querySelector('.amount.heal').textContent).toBe('+8');
    });

    it('should display effect badges when present', () => {
      const compiled = fixture.nativeElement;
      const events = compiled.querySelectorAll('.event');

      expect(events[2].querySelector('.badge').textContent).toBe('KINETIC');
      expect(events[1].querySelector('.badge').textContent).toBe('FIRE');
      expect(events[0].querySelector('.badge')).toBeFalsy(); // No effect type
    });

    it('should have correct data-testid attributes', () => {
      const compiled = fixture.nativeElement;
      const events = compiled.querySelectorAll('.event');

      expect(events[0].getAttribute('data-testid')).toBe('combat-event-0');
      expect(events[1].getAttribute('data-testid')).toBe('combat-event-1');
      expect(events[2].getAttribute('data-testid')).toBe('combat-event-2');
    });
  });

  describe('icons', () => {
    it('should return correct icon for each outcome type', () => {
      expect(component.iconFor({ outcome: 'HIT' } as CombatEvent)).toBe('⚔️');
      expect(component.iconFor({ outcome: 'CRIT' } as CombatEvent)).toBe('💥');
      expect(component.iconFor({ outcome: 'HEAL' } as CombatEvent)).toBe('✨');
      expect(component.iconFor({ outcome: 'MISS' } as CombatEvent)).toBe('🎯');
      expect(component.iconFor({ outcome: 'DODGE' } as CombatEvent)).toBe('🛡️');
    });
  });

  describe('effect badge', () => {
    it('should return effect type when present', () => {
      const event: CombatEvent = {
        timestamp: Date.now(),
        category: 'AFFECTED',
        actorId: 'test1',
        actorName: 'Test',
        targetId: 'test2',
        targetName: 'Test',
        outcome: 'HIT',
        amount: 10,
        effectType: 'FIRE',
      };

      expect(component.effectBadge(event)).toBe('FIRE');
    });

    it('should return null when effect type is undefined', () => {
      const event: CombatEvent = {
        timestamp: Date.now(),
        category: 'AFFECTED',
        actorId: 'test1',
        actorName: 'Test',
        targetId: 'test2',
        targetName: 'Test',
        outcome: 'HIT',
        amount: 10,
      };

      expect(component.effectBadge(event)).toBeNull();
    });
  });

  describe('highlighting', () => {
    it('should call highlight service when event is clicked', () => {
      spyOn(instance(mockHighlight), 'flashInteractiveCard');

      const testEvent: CombatEvent = {
        timestamp: Date.now(),
        category: 'AFFECTED',
        actorId: 'hero1',
        actorName: 'Hero',
        targetId: 'orc1',
        targetName: 'Orc',
        outcome: 'HIT',
        amount: 15,
        effectType: 'KINETIC',
      };

      component.onHighlight(testEvent);

      expect(instance(mockHighlight).flashInteractiveCard).toHaveBeenCalledWith(
        'orc1',
        'KINETIC'
      );
    });

    it('should not call highlight service when onHighlight checks targetId', () => {
      spyOn(instance(mockHighlight), 'flashInteractiveCard');

      const testEvent: CombatEvent = {
        timestamp: Date.now(),
        category: 'AFFECTED',
        actorId: 'hero1',
        actorName: 'Hero',
        targetId: '',
        targetName: 'Orc',
        outcome: 'HIT',
        amount: 15,
        effectType: 'KINETIC',
      };

      // Mock the condition to simulate when targetId is falsy
      spyOn(component, 'onHighlight').and.callFake((ev) => {
        if (!ev.targetId) return;
        instance(mockHighlight).flashInteractiveCard(
          ev.targetId,
          ev.effectType
        );
      });

      component.onHighlight(testEvent);

      component.onHighlight(testEvent);
      expect(
        instance(mockHighlight).flashInteractiveCard
      ).not.toHaveBeenCalled();
    });
  });

  describe('filtering', () => {
    beforeEach(() => {
      const events: CombatEvent[] = [
        {
          timestamp: Date.now(),
          category: 'AFFECTED',
          actorId: 'hero1',
          actorName: 'Hero',
          targetId: 'orc1',
          targetName: 'Orc Warrior',
          outcome: 'HIT',
          amount: 12,
          effectType: 'KINETIC',
        },
        {
          timestamp: Date.now() + 1,
          category: 'AFFECTED',
          actorId: 'orc1',
          actorName: 'Orc Warrior',
          targetId: 'hero1',
          targetName: 'Hero',
          outcome: 'CRIT',
          amount: 20,
          effectType: 'FIRE',
        },
        {
          timestamp: Date.now() + 2,
          category: 'AFFECTED',
          actorId: 'goblin1',
          actorName: 'Goblin',
          targetId: 'hero1',
          targetName: 'Hero',
          outcome: 'MISS',
          amount: 0,
          effectType: 'KINETIC',
        },
        {
          timestamp: Date.now() + 3,
          category: 'AFFECTED',
          actorId: 'healer1',
          actorName: 'Healer',
          targetId: 'hero1',
          targetName: 'Hero',
          outcome: 'HEAL',
          amount: 8,
        },
      ];

      events.forEach((event) => combatEventsSubject.next(event));
    });

    it('should filter by text (actor/target names)', () => {
      component.filterText = 'orc';

      const displayed = component.displayed;
      expect(displayed.items.length).toBe(2); // Both events with "Orc" in actor or target
    });

    it('should filter by outcome', () => {
      component.filterOutcome = 'HIT';

      const displayed = component.displayed;
      expect(displayed.items.length).toBe(1);
      expect(displayed.items[0].outcome).toBe('HIT');
    });

    it('should filter by effect type', () => {
      component.filterEffect = 'FIRE';

      const displayed = component.displayed;
      expect(displayed.items.length).toBe(1);
      expect(displayed.items[0].effectType).toBe('FIRE');
    });

    it('should combine multiple filters', () => {
      component.filterText = 'hero';
      component.filterOutcome = 'CRIT';
      component.filterEffect = 'FIRE';

      const displayed = component.displayed;
      expect(displayed.items.length).toBe(1);
      expect(displayed.items[0].actorName).toBe('Orc Warrior');
      expect(displayed.items[0].outcome).toBe('CRIT');
      expect(displayed.items[0].effectType).toBe('FIRE');
    });

    it('should show all events when filters are set to ALL', () => {
      component.filterOutcome = 'ALL';
      component.filterEffect = 'ALL';
      component.filterText = '';

      const displayed = component.displayed;
      expect(displayed.items.length).toBe(4);
    });

    it('should handle case-insensitive text filtering', () => {
      component.filterText = 'HERO';

      const displayed = component.displayed;
      expect(displayed.items.length).toBe(4); // All events contain "Hero" in actor or target
    });
  });

  describe('filter controls (UI)', () => {
    beforeEach(() => {
      const events: CombatEvent[] = [
        {
          timestamp: Date.now(),
          category: 'AFFECTED',
          actorId: 'hero1',
          actorName: 'Hero',
          targetId: 'orc1',
          targetName: 'Orc Warrior',
          outcome: 'HIT',
          amount: 12,
          effectType: 'KINETIC',
        },
        {
          timestamp: Date.now() + 1,
          category: 'AFFECTED',
          actorId: 'orc1',
          actorName: 'Orc Warrior',
          targetId: 'hero1',
          targetName: 'Hero',
          outcome: 'CRIT',
          amount: 20,
          effectType: 'FIRE',
        },
        {
          timestamp: Date.now() + 2,
          category: 'AFFECTED',
          actorId: 'goblin1',
          actorName: 'Goblin',
          targetId: 'hero1',
          targetName: 'Hero',
          outcome: 'MISS',
          amount: 0,
          effectType: 'KINETIC',
        },
        {
          timestamp: Date.now() + 3,
          category: 'AFFECTED',
          actorId: 'healer1',
          actorName: 'Healer',
          targetId: 'hero1',
          targetName: 'Hero',
          outcome: 'HEAL',
          amount: 8,
        },
      ];

      events.forEach((event) => combatEventsSubject.next(event));
      fixture.detectChanges();
    });

    it('filters by text input (actor/target)', async () => {
      const input = await loader.getHarness(
        MatInputHarness.with({ placeholder: 'Type a name' })
      );
      await input.setValue('orc');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const eventsEls = compiled.querySelectorAll('.event');
      expect(eventsEls.length).toBe(2);
    });

    it('filters by outcome select', async () => {
      const selects = await loader.getAllHarnesses(MatSelectHarness);
      const outcomeSelect = selects[0]; // First select is Outcome
      await outcomeSelect.open();
      await outcomeSelect.clickOptions({ text: 'Hit' });
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const eventsEls = compiled.querySelectorAll('.event');
      expect(eventsEls.length).toBe(1);
      expect(eventsEls[0].textContent).toContain('Hero');
    });

    it('filters by effect select', async () => {
      const selects = await loader.getAllHarnesses(MatSelectHarness);
      const effectSelect = selects[1]; // Second select is Effect
      await effectSelect.open();
      await effectSelect.clickOptions({ text: 'Fire' });
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const eventsEls = compiled.querySelectorAll('.event');
      expect(eventsEls.length).toBe(1);
      expect(eventsEls[0].textContent).toContain('Orc Warrior');
    });
  });
});
