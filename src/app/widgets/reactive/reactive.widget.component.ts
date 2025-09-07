import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  NgZone,
} from '@angular/core';

import { interval, Subscription } from 'rxjs';

import { InteractiveInterface } from '@interfaces/interactive.interface';
import { ActionableEvent } from '@events/actionable.event';
import { ActionableDefinition } from '@definitions/actionable.definition';
import { ArrayView } from '@wrappers/array.view';
import { WithSubscriptionHelper } from '../../helpers/with-subscription.helper';
import { CharacterService } from '@services/character.service';
import { SettingsStore } from '@stores/settings.store';
import { GameStringsStore } from '@stores/game-strings.store';
import { ActionableLiteral } from '@literals/actionable.literal';
import skillsData from '@assets/skills.json';
import { PlayerInterface } from '../../../backend/interfaces/player.interface';

@Component({
  selector: 'app-reactive-widget',
  templateUrl: './reactive.widget.component.html',
  styleUrls: ['./reactive.widget.component.css'],
  providers: [WithSubscriptionHelper],
})
export class ReactiveWidgetComponent implements OnInit, OnDestroy {
  @Input() public interactive!: InteractiveInterface;
  @Input() public density: 'compact' | 'cozy' | 'comfortable' = 'cozy';
  @Output() public actionSelected = new EventEmitter<ActionableEvent>();

  public get actions(): ArrayView<ActionableDefinition> {
    return this.interactive.actions;
  }

  public get hasActions(): boolean {
    return this.actions.items.length > 0;
  }

  public get isReactive(): boolean {
    return this.interactive.classification === 'REACTIVE';
  }

  public onActionSelected(action: ActionableDefinition): void {
    const event = new ActionableEvent(action, this.interactive.id);
    this.actionSelected.emit(event);
  }

  public get densityClass(): string {
    return `density-${this.density}`;
  }

  // Tooltips
  public readonly aggressiveTooltip: string =
    GameStringsStore.tooltips['aggressive'];
  public readonly retaliateTooltip: string =
    GameStringsStore.tooltips['retaliate'];
  public readonly playerTooltip: string =
    GameStringsStore.tooltips['retaliate'];
  public readonly searchTooltip: string = GameStringsStore.tooltips['search'];
  public readonly visibilityTooltip: string =
    GameStringsStore.tooltips['visibility'];

  public detectHidden = false;
  public detectDisguised = false;

  private currentAP = 0;
  private cooldowns: { [key: string]: number } = {};
  private cooldownsCapturedAt = Date.now();
  private tickerSub?: Subscription;

  constructor(
    private readonly withSubscriptionHelper: WithSubscriptionHelper,
    private readonly ngZone: NgZone,
    @Optional() private readonly characterService?: CharacterService
  ) {}

  ngOnInit(): void {
    if (this.characterService) {
      this.currentAP =
        this.characterService.currentCharacter.derivedAttributes[
          'CURRENT AP'
        ].value;
      this.withSubscriptionHelper.addSubscription(
        this.characterService.characterChanged$.subscribe(
          (c: PlayerInterface) => {
            this.currentAP = c.derivedAttributes['CURRENT AP'].value;

            this.cooldowns = c.cooldowns as { [key: string]: number };
            this.cooldownsCapturedAt = Date.now();
            this.ensureTicker();
          }
        )
      );
    } else {
      this.currentAP = Number.MAX_SAFE_INTEGER;
    }

    this.withSubscriptionHelper.addSubscription(
      this.interactive.actionsChanged$.subscribe(() => {
        this.ensureTicker();
      })
    );

    if (this.interactive.ignores?.items.length) {
      this.detectHidden = !this.interactive.ignores.items.includes('HIDDEN');
      this.detectDisguised =
        !this.interactive.ignores.items.includes('DISGUISED');
    }
  }

  ngOnDestroy(): void {
    this.withSubscriptionHelper.unsubscribeAll();
  }

  // Costs/Tooltips
  public apCost(action: ActionableDefinition): number {
    const key =
      action.actionable as unknown as keyof typeof SettingsStore.settings.ruleCost;
    const cost = SettingsStore.settings.ruleCost[key] ?? 0;
    return cost;
  }

  public canAfford(action: ActionableDefinition): boolean {
    return this.currentAP >= this.apCost(action);
  }

  public apTooltipSuffix(action: ActionableDefinition): string {
    const cost = this.apCost(action);
    if (cost <= 0) return '';
    const suffix = ` — AP: ${cost}`;
    if (!this.canAfford(action)) return `${suffix} (insufficient)`;
    return suffix;
  }

  public cooldownSeconds(action: ActionableDefinition): number | null {
    if (!this.cooldowns) return null;
    if (action.actionable === 'SKILL') {
      const baseMsByLabel = this.cooldowns[action.label as string];
      const baseMsByName = this.cooldowns[action.name as string];
      const base = baseMsByLabel || baseMsByName;
      if (base && base > 0) {
        const elapsed = Date.now() - this.cooldownsCapturedAt;
        const remaining = base - elapsed;
        if (remaining > 0) return Math.ceil(remaining / 1000);
        return null;
      }
    }
    return null;
  }

  private hasEngagement(): boolean {
    if (!this.cooldowns) return false;
    const base = this.cooldowns['ENGAGEMENT'];
    if (typeof base !== 'number' || base <= 0) return false;
    const elapsed = Date.now() - this.cooldownsCapturedAt;
    return base - elapsed > 0;
  }

  private isNonCombatSkill(action: ActionableDefinition): boolean {
    if (action.actionable !== 'SKILL') return false;
    const skills = (
      skillsData as { skills: { name: string; combat: boolean }[] }
    ).skills;
    const key = (action.label || action.name) as string;
    const found = skills.find((s) => s.name === key);
    return !!found && !found.combat;
  }

  public isEngagementBlocked(action: ActionableDefinition): boolean {
    return this.isNonCombatSkill(action) && this.hasEngagement();
  }

  public engagementSeconds(): number | null {
    if (!this.hasEngagement()) return null;
    const base = this.cooldowns['ENGAGEMENT'];
    const elapsed = Date.now() - this.cooldownsCapturedAt;
    const remaining = base - elapsed;
    if (remaining > 0) return Math.ceil(remaining / 1000);
    return null;
  }

  private ensureTicker(): void {
    if (this.tickerSub) return;
    const hasSkill = !!this.interactive.actions.items.find(
      (a) => a.actionable === 'SKILL'
    );
    const hasEng = this.hasEngagement();
    if (hasSkill || hasEng) {
      this.ngZone.runOutsideAngular(() => {
        this.tickerSub = interval(1000).subscribe(() => {
          this.cooldownsCapturedAt = this.cooldownsCapturedAt - 0;
        });
      });
      if (this.tickerSub) {
        this.withSubscriptionHelper.addSubscription(this.tickerSub);
      }
    }
  }

  public setIcon(actionable: ActionableLiteral) {
    switch (actionable) {
      case 'SCENE':
        return { tooltip: 'Transit to next scene' };
      case 'SKILL':
        return { tooltip: 'Skill check' };
      case 'PICK':
        return { tooltip: 'Pick up item' };
      case 'AFFECT':
        return { tooltip: 'Use equipped weapon on target' };
      case 'USE':
        return { tooltip: 'Use item from inventory' };
      case 'INTERACTION':
        return { tooltip: 'Interact with the target' };
      default:
        return { tooltip: 'Action not recognized' };
    }
  }

  public actionEmoji(actionable: ActionableLiteral): string {
    switch (actionable) {
      case 'SCENE':
        return '🗺️';
      case 'SKILL':
        return '🎯';
      case 'PICK':
        return '📦';
      case 'AFFECT':
        return '⚔️';
      case 'USE':
        return '🛠️';
      case 'INTERACTION':
        return '💬';
      case 'EQUIP':
        return '🗡️';
      case 'UNEQUIP':
        return '📥';
      case 'READ':
        return '📖';
      case 'DROP':
        return '🗑️';
      case 'WEAR':
        return '🛡️';
      case 'STRIP':
        return '🧥';
      default:
        return '❔';
    }
  }

  public hasDerivedAttributes(): boolean {
    const i = this.interactive as unknown as {
      derivedAttributes?: Record<string, { value: number }>;
    };
    return !!i?.derivedAttributes;
  }

  public attrValue(key: string): number | null {
    const i = this.interactive as unknown as {
      derivedAttributes?: Record<string, { value: number }>;
    };
    const v = i?.derivedAttributes?.[key]?.value;
    return typeof v === 'number' ? v : null;
  }

  public ratio(currentKey: string, maxKey: string): number | null {
    const cur = this.attrValue(currentKey);
    const max = this.attrValue(maxKey);
    if (cur === null || max === null || max <= 0) return null;
    return Math.max(0, Math.min(100, Math.round((cur / max) * 100)));
  }

  public hasEngagementChip(): boolean {
    return (
      !!this.cooldowns &&
      typeof this.cooldowns['ENGAGEMENT'] === 'number' &&
      this.cooldowns['ENGAGEMENT'] > 0
    );
  }
}
