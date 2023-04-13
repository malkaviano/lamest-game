import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ActionableItemView } from '../../view-models/actionable-item.view';
import { CharacterValuesView } from '../../view-models/character-values.view';
import { GameItemDefinition } from '../../definitions/game-item.definition';
import { SceneDefinition } from '../../definitions/scene.definition';
import { ActionableEvent } from '../../events/actionable.event';
import { WithSubscriptionHelper } from '../../helpers/with-subscription.helper';
import { ArrayView } from '../../view-models/array.view';
import { FormatterHelperService } from '../../helpers/formatter.helper.service';
import { ReaderDialogComponent } from '../../dialogs/reader/reader.dialog.component';
import { ReadableInterface } from '../../interfaces/readable.interface';
import { LogMessageDefinition } from '../../definitions/log-message.definition';
import { GameLoopService } from '../../services/game-loop.service';

@Component({
  selector: 'app-game-page',
  templateUrl: './game.page.component.html',
  styleUrls: ['./game.page.component.css'],
  providers: [WithSubscriptionHelper],
})
export class GamePageComponent implements OnInit, OnDestroy {
  private readonly gameLogs: string[];

  public scene: SceneDefinition;

  public characterValues: CharacterValuesView;

  public inventory: ActionableItemView[];

  public equipped!: GameItemDefinition;

  public canAct: boolean;

  constructor(
    // private readonly gameLoopService: gameLoopService,
    private readonly withSubscriptionHelper: WithSubscriptionHelper,
    private readonly formatterHelperService: FormatterHelperService,
    private readonly dialog: MatDialog,
    private readonly gameLoopService: GameLoopService
  ) {
    this.gameLogs = [];

    this.inventory = [];

    this.characterValues = CharacterValuesView.create(
      ArrayView.create([]),
      ArrayView.create([]),
      ArrayView.create([]),
      ArrayView.create([])
    );

    this.scene = new SceneDefinition('', ArrayView.create([]), '');

    this.canAct = true;
  }

  ngOnDestroy(): void {
    this.gameLoopService.stop();

    this.withSubscriptionHelper.unsubscribeAll();
  }

  ngOnInit(): void {
    this.withSubscriptionHelper.addSubscription(
      this.gameLoopService.events.characterChanged$.subscribe((character) => {
        this.characterValues =
          this.formatterHelperService.characterToKeyValueDescription(character);

        this.equipped = character.weaponEquipped;
      })
    );

    this.withSubscriptionHelper.addSubscription(
      this.gameLoopService.events.sceneChanged$.subscribe(
        (scene) => (this.scene = scene)
      )
    );

    this.withSubscriptionHelper.addSubscription(
      this.gameLoopService.events.actionLogged$.subscribe((log) => {
        this.gameLogs.unshift(this.printLog(log));
      })
    );

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

    this.withSubscriptionHelper.addSubscription(
      this.gameLoopService.events.canActChanged$.subscribe((canAct) => {
        this.canAct = canAct;
      })
    );

    this.gameLoopService.start();
  }

  public informActionSelected(action: ActionableEvent): void {
    this.gameLoopService.actionableReceived(action);
  }

  public get logs(): ArrayView<string> {
    return ArrayView.create(this.gameLogs);
  }

  private printLog(logMessage: LogMessageDefinition): string {
    return `${logMessage.actor}: ${logMessage.message}`;
  }

  private openReaderDialog(data: ReadableInterface): void {
    this.dialog.open(ReaderDialogComponent, {
      data,
      autoFocus: false,
    });
  }
}
