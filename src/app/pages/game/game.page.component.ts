import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ActionableItemDefinition } from '@definitions/actionable-item.definitions';
import { GameItemDefinition } from '@definitions/game-item.definition';
import { LogMessageDefinition } from '@definitions/log-message.definition';
import { ActionableEvent } from '@events/actionable.event';
import { ReadableDefinition } from '@definitions/readable.definition';
import { GameLoopService } from '@services/game-loop.service';
import { GameStringsStore } from '@stores/game-strings.store';
import { ArrayView } from '@wrappers/array.view';
import { CharacterStatusView } from '../../view-models/character-status.view';
import { ReaderDialogComponent } from '../../dialogs/reader/reader.dialog.component';
import { ViewerComponent } from '../../dialogs/viewer/viewer.dialog.component';
import { FormatterHelperService } from '../../helpers/formatter.helper.service';
import { WithSubscriptionHelper } from '../../helpers/with-subscription.helper';
import { FeedbackService } from '../../services/feedback.service';
import { FloatingNumbersService } from '../../services/floating-numbers.service';
import { CombatFeedService } from '../../services/combat-feed.service';
import { HighlightService } from '../../services/highlight.service';
import { ViewableInterface } from '../../interfaces/viewable.interface';
import { CharacterValuesView } from '../../view-models/character-values.view';
import { KeyValueDescriptionView } from '../../view-models/key-value-description.view';
import { SceneEntity } from '@entities/scene.entity';
import { CombatEvent } from '@interfaces/combat-event.interface';
import { InteractiveInterface } from '@interfaces/interactive.interface';

@Component({
  selector: 'app-game-page',
  templateUrl: './game.page.component.html',
  styleUrls: ['./game.page.component.css'],
  providers: [WithSubscriptionHelper],
})
export class GamePageComponent implements OnInit, OnDestroy {
  @ViewChild('floatingContainer', { read: ViewContainerRef, static: true })
  floatingContainer!: ViewContainerRef;
  private gameLogs: ArrayView<string>;

  public scene!: SceneEntity;

  public characterValues: CharacterValuesView;

  public inventory: ActionableItemDefinition[];

  public equipped!: GameItemDefinition;

  public wearing!: GameItemDefinition;

  public characterStatus!: CharacterStatusView;

  constructor(
    private readonly withSubscriptionHelper: WithSubscriptionHelper,
    private readonly formatterHelperService: FormatterHelperService,
    private readonly dialog: MatDialog,
    private readonly gameLoopService: GameLoopService,
    private readonly feedbackService: FeedbackService,
    private readonly floatingNumbersService: FloatingNumbersService,
    private readonly combatFeed: CombatFeedService,
    private readonly highlight: HighlightService
  ) {
    this.gameLogs = ArrayView.empty();

    this.inventory = [];

    this.characterValues = CharacterValuesView.create(
      ArrayView.empty(),
      ArrayView.empty(),
      ArrayView.empty(),
      ArrayView.empty()
    );
  }

  ngOnDestroy(): void {
    this.gameLoopService.stop();

    this.withSubscriptionHelper.unsubscribeAll();
  }

  ngOnInit(): void {
    // Configure the floating numbers service early to catch initial events
    this.floatingNumbersService.setViewContainer(this.floatingContainer);

    this.withSubscriptionHelper.addSubscription(
      this.gameLoopService.events.playerChanged$.subscribe((character) => {
        this.characterValues =
          this.formatterHelperService.characterToKeyValueDescription(character);

        this.equipped = character.weaponEquipped;

        this.wearing = character.armorWearing;

        const hp = KeyValueDescriptionView.create(
          'HP',
          `${this.characterValues.derivedAttributes.items[2].value}` +
            ' | ' +
            `${this.characterValues.derivedAttributes.items[0].value}`,
          GameStringsStore.descriptions['HP'],
          'derived-attribute'
        );

        const ep = KeyValueDescriptionView.create(
          'EP',
          `${this.characterValues.derivedAttributes.items[3].value}` +
            ' | ' +
            `${this.characterValues.derivedAttributes.items[1].value}`,
          GameStringsStore.descriptions['EP'],
          'derived-attribute'
        );

        const ap = KeyValueDescriptionView.create(
          'AP',
          `${this.characterValues.derivedAttributes.items[5].value}` +
            ' | ' +
            `${this.characterValues.derivedAttributes.items[4].value}`,
          GameStringsStore.descriptions['AP'],
          'derived-attribute'
        );

        this.characterStatus = CharacterStatusView.create(
          character.id,
          ArrayView.create(hp, ep, ap),
          this.equipped,
          this.wearing,
          this.characterValues.identity.items[6]
        );
      })
    );

    this.withSubscriptionHelper.addSubscription(
      this.gameLoopService.events.sceneChanged$.subscribe(
        (scene) => (this.scene = scene)
      )
    );

    this.withSubscriptionHelper.addSubscription(
      this.gameLoopService.events.actionLogged$.subscribe((log) => {
        this.gameLogs = this.gameLogs.insert(this.printLog(log));

        // Avoid double-playing sounds if combat events are active
        if (this.gameLoopService.events.combatEvents$) {
          this.feedbackService.showToastOnly(log);
        } else {
          this.feedbackService.showFeedback(log);
        }
        // Only XP still comes from logs
        this.handleXP(log);
      })
    );

    if (this.gameLoopService.events.combatEvents$) {
      this.withSubscriptionHelper.addSubscription(
        this.gameLoopService.events.combatEvents$.subscribe(
          (event: CombatEvent) => {
            this.handleCombatEvent(event);
          }
        )
      );
    }

    this.withSubscriptionHelper.addSubscription(
      this.gameLoopService.events.playerInventory$.subscribe((inventory) => {
        this.inventory = inventory.items;
      })
    );

    this.withSubscriptionHelper.addSubscription(
      this.gameLoopService.events.documentOpened$.subscribe((documentText) => {
        this.openReaderDialog(documentText);
      })
    );

    this.gameLoopService.start();
  }

  private handleCombatEvent(event: CombatEvent): void {
    const anchor = this.getTargetAnchor(event.targetId, event.targetName);
    this.combatFeed.handle(event, anchor ?? undefined);
    if (event.targetId)
      this.highlight.flashInteractiveCard(event.targetId, event.effectType);
  }

  private handleXP(log: LogMessageDefinition): void {
    const anchor = this.getActorAnchorCenter(log.actor);
    const centerX = anchor?.x ?? window.innerWidth / 2;
    const centerY = anchor?.y ?? window.innerHeight / 2;
    const expMatch = log.message.match(/\b(\d+)\b\s*(xp|experience)\b/i);
    if (expMatch) {
      const exp = parseInt(expMatch[1], 10);
      const charEl = document.querySelector(
        '[data-testid="character"]'
      ) as HTMLElement | null;
      if (charEl) {
        const rect = charEl.getBoundingClientRect();
        this.floatingNumbersService.showExperience(
          exp,
          rect.left + rect.width / 2,
          rect.top - 10
        );
      } else {
        this.floatingNumbersService.showExperience(exp, centerX + 100, centerY);
      }
    }
  }

  public informActionSelected(action: ActionableEvent): void {
    this.gameLoopService.actionableReceived(action);
  }

  public informSceneOpened(image: ViewableInterface): void {
    this.openViewerDialog(image);
  }

  public informDodgeOption(options: {
    readonly dodge?: boolean;
    readonly visible?: boolean;
  }): void {
    if (options?.dodge) {
      this.gameLoopService.actorDodge(options.dodge);
    }

    if (options?.visible) {
      this.gameLoopService.becomeVisible();
    }
  }

  public get logs(): ArrayView<string> {
    return this.gameLogs;
  }

  private printLog(logMessage: LogMessageDefinition): string {
    return `${logMessage.actor}: ${logMessage.message}`;
  }

  private openReaderDialog(data: ReadableDefinition): void {
    this.dialog.open(ReaderDialogComponent, {
      data,
      autoFocus: false,
    });
  }

  private openViewerDialog(data: ViewableInterface): void {
    this.dialog.open(ViewerComponent, {
      data,
      autoFocus: false,
    });
  }

  // Removed log-parsing for damage/heal. Combat visuals come from CombatEvent stream.

  private getActorAnchorCenter(
    actorName: string
  ): { x: number; y: number } | null {
    // 1) Try to find interactive by name in current scene and use its DOM card rect
    try {
      const interactive = this.scene?.visibleInteractives?.items?.find?.(
        (i: InteractiveInterface) => i?.name === actorName
      );

      if (interactive?.id) {
        const el = document.querySelector(
          `[data-testid="interactive-${interactive.id}"]`
        ) as HTMLElement | null;
        if (el) {
          const rect = el.getBoundingClientRect();
          return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          };
        }
      }
    } catch {
      // ignore lookup errors, fallback below
    }

    // 2) If it's the player (actor not in interactives), use the character panel as anchor
    const characterEl = document.querySelector(
      '[data-testid="character"]'
    ) as HTMLElement | null;

    if (characterEl) {
      const rect = characterEl.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + 40 };
    }

    // 3) No anchor found
    return null;
  }

  private getTargetAnchor(
    targetId: string,
    targetName: string
  ): { x: number; y: number } | null {
    if (targetId) {
      const el = document.querySelector(
        `[data-testid="interactive-${targetId}"]`
      ) as HTMLElement | null;
      if (el) {
        const rect = el.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      }
    }
    return this.getActorAnchorCenter(targetName);
  }
}
