import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { CombatEvent } from '@interfaces/combat-event.interface';
import { GameLoopService } from '@services/game-loop.service';
import { ArrayView } from '@wrappers/array.view';
import { HighlightService } from '../../services/highlight.service';

@Component({
  selector: 'app-combat-timeline-panel',
  templateUrl: './combat-timeline.panel.component.html',
  styleUrls: ['./combat-timeline.panel.component.css'],
})
export class CombatTimelinePanelComponent implements OnInit, OnDestroy {
  events: ArrayView<CombatEvent> = ArrayView.empty();
  private sub?: Subscription;

  // Filters
  public filterText = '';
  public filterOutcome: 'ALL' | 'HIT' | 'CRIT' | 'HEAL' | 'MISS' | 'DODGE' = 'ALL';
  public filterEffect: 'ALL' | 'KINETIC' | 'FIRE' | 'ACID' | 'PROFANE' | 'SACRED' = 'ALL';

  constructor(
    private readonly gameLoop: GameLoopService,
    private readonly highlight: HighlightService
  ) {}

  ngOnInit(): void {
    const stream = this.gameLoop.events.combatEvents$;
    if (stream) {
      this.sub = stream.subscribe((ev) => this.addEvent(ev));
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  addEvent(ev: CombatEvent): void {
    this.events = this.events.insert(ev);
  }

  clear(): void {
    this.events = ArrayView.empty();
  }

  iconFor(ev: CombatEvent): string {
    switch (ev.outcome) {
      case 'CRIT':
        return '💥';
      case 'HIT':
        return '⚔️';
      case 'HEAL':
        return '✨';
      case 'MISS':
        return '🎯';
      case 'DODGE':
        return '🛡️';
      default:
        return '❔';
    }
  }

  effectBadge(ev: CombatEvent): string | null {
    return ev.effectType ? ev.effectType : null;
  }

  onHighlight(ev: CombatEvent): void {
    if (ev.targetId) this.highlight.flashInteractiveCard(ev.targetId, ev.effectType);
  }

  public get displayed(): ArrayView<CombatEvent> {
    const text = this.filterText.trim().toLowerCase();
    const outcome = this.filterOutcome;
    const effect = this.filterEffect;
    const filtered = this.events.items.filter((ev) => {
      if (outcome !== 'ALL' && ev.outcome !== outcome) return false;
      if (effect !== 'ALL' && ev.effectType !== effect) return false;
      if (text) {
        const hay = `${ev.actorName ?? ''} ${ev.targetName ?? ''}`.toLowerCase();
        if (!hay.includes(text)) return false;
      }
      return true;
    });
    return ArrayView.fromArray(filtered);
  }
}
