import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { CombatEvent } from '@interfaces/combat-event.interface';
import { GameLoopService } from '@services/game-loop.service';
import { HighlightService } from '../../services/highlight.service';

@Component({
  selector: 'app-combat-timeline-panel',
  templateUrl: './combat-timeline.panel.component.html',
  styleUrls: ['./combat-timeline.panel.component.css'],
})
export class CombatTimelinePanelComponent implements OnInit, OnDestroy {
  events: CombatEvent[] = [];
  private sub?: Subscription;
  private readonly maxItems = 30;

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
    this.events.unshift(ev);
    if (this.events.length > this.maxItems) this.events.length = this.maxItems;
  }

  clear(): void {
    this.events = [];
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
}
