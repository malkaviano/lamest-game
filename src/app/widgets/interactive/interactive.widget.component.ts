import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
} from '@angular/core';

import { ActionableDefinition } from '@definitions/actionable.definition';
import { ActionableEvent } from '@events/actionable.event';
import { ArrayView } from '@wrappers/array.view';
import { InteractiveInterface } from '@interfaces/interactive.interface';
import { WithSubscriptionHelper } from '../../helpers/with-subscription.helper';
import { GameStringsStore } from '@stores/game-strings.store';
import { ActionableLiteral } from '@literals/actionable.literal';
import { SettingsStore } from '@stores/settings.store';
import { CharacterService } from '@services/character.service';
import skillsData from '@assets/skills.json';
import { interval, Subscription } from 'rxjs';

type PlayerLike = {
  readonly derivedAttributes: { [key: string]: { value: number } };
  readonly cooldowns: { [key: string]: number };
};

type SkillJson = { name: string; combat: boolean };

@Component({
  selector: 'app-interactive-widget',
  templateUrl: './interactive.widget.component.html',
  styleUrls: ['./interactive.widget.component.css'],
  providers: [WithSubscriptionHelper],
})
export class InteractiveWidgetComponent implements OnInit, OnDestroy {
  private readonly basePath: string;

  @Input() interactive!: InteractiveInterface;
  @Output() actionSelected: EventEmitter<ActionableEvent>;
  actions: ArrayView<ActionableDefinition>;

  public readonly aggressiveTooltip: string;
  public readonly retaliateTooltip: string;
  public readonly playerTooltip: string;
  public readonly searchTooltip: string;
  public readonly visibilityTooltip: string;

  public detectHidden: boolean;
  public detectDisguised: boolean;

  private currentAP = 0;
  private cooldowns: { [key: string]: number } = {};
  private cooldownsCapturedAt = Date.now();
  private tickerSub?: Subscription;

  constructor(
    private readonly withSubscriptionHelper: WithSubscriptionHelper,
    @Optional() private readonly characterService?: CharacterService
  ) {
    this.actionSelected = new EventEmitter<ActionableEvent>();
    this.actions = ArrayView.empty();

    this.aggressiveTooltip = GameStringsStore.tooltips['aggressive'];
    this.retaliateTooltip = GameStringsStore.tooltips['retaliate'];
    this.playerTooltip = GameStringsStore.tooltips['retaliate'];
    this.searchTooltip = GameStringsStore.tooltips['search'];
    this.visibilityTooltip = GameStringsStore.tooltips['visibility'];

    this.detectHidden = false;
    this.detectDisguised = false;

    this.basePath = '../../../assets/icons';
  }

  ngOnInit(): void {
    if (this.characterService) {
      // Initialize current AP synchronously
      try {
        this.currentAP = this.characterService.currentCharacter.derivedAttributes['CURRENT AP'].value;
      } catch (e) {
        // ignore
      }
      // Track current AP for enabling/disabling actions and showing costs
      this.withSubscriptionHelper.addSubscription(
        this.characterService.characterChanged$.subscribe((c: PlayerLike) => {
          this.currentAP = c.derivedAttributes['CURRENT AP'].value;
          this.cooldowns = c.cooldowns as { [key: string]: number };
          this.cooldownsCapturedAt = Date.now();
        })
      );
    } else {
      // In tests without provider, allow actions by default
      this.currentAP = Number.MAX_SAFE_INTEGER;
    }

    // Ticker will be started lazily when there are skill actions to show cooldown
    this.withSubscriptionHelper.addSubscription(
      this.interactive.actionsChanged$.subscribe((actions) => {
        this.actions = actions;
        if (!this.tickerSub && this.characterService) {
          const hasSkill = !!actions.items.find((a) => a.actionable === 'SKILL');
          if (hasSkill) {
            this.tickerSub = interval(1000).subscribe(() => {
              this.cooldownsCapturedAt = this.cooldownsCapturedAt - 0;
            });
            this.withSubscriptionHelper.addSubscription(this.tickerSub);
          }
        }
      })
    );

    if (
      this.interactive.classification !== 'REACTIVE' &&
      this.interactive.ignores?.items.length
    ) {
      this.detectHidden = !this.interactive.ignores.items.includes('HIDDEN');
      this.detectDisguised =
        !this.interactive.ignores.items.includes('DISGUISED');
    }
  }

  ngOnDestroy(): void {
    this.withSubscriptionHelper.unsubscribeAll();
  }

  onActionSelected(action: ActionableDefinition): void {
    this.actionSelected.emit(new ActionableEvent(action, this.interactive.id));
  }

  public apCost(action: ActionableDefinition): number {
    // Actionable literals match rule names in settings
    const key = action.actionable as unknown as keyof typeof SettingsStore.settings.ruleCost;
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
    if (!this.canAfford(action)) {
      return `${suffix} (insufficient)`;
    }
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
    return !!this.cooldowns && typeof this.cooldowns['ENGAGEMENT'] === 'number' && this.cooldowns['ENGAGEMENT'] > 0;
  }

  private isNonCombatSkill(action: ActionableDefinition): boolean {
    if (action.actionable !== 'SKILL') return false;
    const skills = (skillsData as { skills: SkillJson[] }).skills;
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

  public setIcon(actionable: ActionableLiteral) {
    switch (actionable) {
      case 'SCENE':
        return {
          icon: `${this.basePath}/scene.svg`,
          tooltip: 'Transit to next scene',
        };
      case 'SKILL':
        return {
          icon: `${this.basePath}/skill.svg`,
          tooltip: `Skill check`,
        };
      case 'PICK':
        return {
          icon: `${this.basePath}/pick.svg`,
          tooltip: `Pick up item`,
        };
      case 'AFFECT':
        return {
          icon: `${this.basePath}/affect.svg`,
          tooltip: `Use equipped weapon on target`,
        };
      case 'USE':
        return {
          icon: `${this.basePath}/use.svg`,
          tooltip: `Use item from inventory`,
        };
      case 'INTERACTION':
        return {
          icon: `${this.basePath}/interaction.svg`,
          tooltip: `Interact with the target`,
        };
      default:
        return {
          icon: `${this.basePath}/none.svg`,
          tooltip: 'Action not recognized',
        };
    }
  }

  // --- Mini-bars helpers (HP/EP/AP) ---
  public hasDerivedAttributes(): boolean {
    const i = this.interactive as unknown as { derivedAttributes?: Record<string, { value: number }> };
    return !!i?.derivedAttributes;
  }

  public attrValue(key: string): number | null {
    const i = this.interactive as unknown as { derivedAttributes?: Record<string, { value: number }> };
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
    return !!this.cooldowns && typeof this.cooldowns['ENGAGEMENT'] === 'number' && this.cooldowns['ENGAGEMENT'] > 0;
  }
}
