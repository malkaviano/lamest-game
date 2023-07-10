import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { SceneDefinition } from '@definitions/scene.definition';
import { CharacterValuesView } from '../../view-models/character-values.view';
import { ActionableItemView } from '@conceptual/view-models/actionable-item.view';
import { GameItemDefinition } from '@definitions/game-item.definition';
import { CharacterStatusView } from 'src/app/view-models/character-status.view';
import { ArrayView } from '@conceptual/view-models/array.view';
import { KeyValueDescriptionView } from '../../view-models/key-value-description.view';
import { GameStringsStore } from '../../../stores/game-strings.store';
import { ActionableEvent } from '@conceptual/events/actionable.event';
import { LogMessageDefinition } from '@definitions/log-message.definition';
import { ReadableInterface } from '@conceptual/interfaces/readable.interface';
import { ReaderDialogComponent } from '../../dialogs/reader/reader.dialog.component';
import { FormatterHelperService } from '../../helpers/formatter.helper.service';
import { WithSubscriptionHelper } from '../../helpers/with-subscription.helper';
import { ViewableInterface } from '@conceptual/interfaces/viewable.interface';
import { ViewerComponent } from '../../dialogs/viewer/viewer.dialog.component';
import { GameLoopService } from '../../../backend/services/game-loop.service';

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

  public characterStatus!: CharacterStatusView;

  constructor(
    private readonly withSubscriptionHelper: WithSubscriptionHelper,
    private readonly formatterHelperService: FormatterHelperService,
    private readonly dialog: MatDialog,
    private readonly gameLoopService: GameLoopService
  ) {
    this.gameLogs = [];

    this.inventory = [];

    this.characterValues = CharacterValuesView.create(
      ArrayView.empty(),
      ArrayView.empty(),
      ArrayView.empty(),
      ArrayView.empty()
    );

    this.scene = new SceneDefinition('', ArrayView.empty(), '');
  }

  ngOnDestroy(): void {
    this.gameLoopService.stop();

    this.withSubscriptionHelper.unsubscribeAll();
  }

  ngOnInit(): void {
    this.withSubscriptionHelper.addSubscription(
      this.gameLoopService.events.playerChanged$.subscribe((character) => {
        this.characterValues =
          this.formatterHelperService.characterToKeyValueDescription(character);

        this.equipped = character.weaponEquipped;

        const hp = KeyValueDescriptionView.create(
          'HP',
          `${this.characterValues.derivedAttributes.items[2].value}` +
            ' | ' +
            `${this.characterValues.derivedAttributes.items[0].value}`,
          GameStringsStore.descriptions['HP']
        );

        const ep = KeyValueDescriptionView.create(
          'EP',
          `${this.characterValues.derivedAttributes.items[3].value}` +
            ' | ' +
            `${this.characterValues.derivedAttributes.items[1].value}`,
          GameStringsStore.descriptions['EP']
        );

        const ap = KeyValueDescriptionView.create(
          'AP',
          `${this.characterValues.derivedAttributes.items[5].value}` +
            ' | ' +
            `${this.characterValues.derivedAttributes.items[4].value}`,
          GameStringsStore.descriptions['AP']
        );

        this.characterStatus = CharacterStatusView.create(
          ArrayView.create(hp, ep, ap),
          this.equipped,
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

    this.gameLoopService.start();
  }

  public informActionSelected(action: ActionableEvent): void {
    this.gameLoopService.actionableReceived(action);
  }

  public informSceneOpened(image: ViewableInterface): void {
    this.openViewerDialog(image);
  }

  public get logs(): ArrayView<string> {
    return ArrayView.fromArray(this.gameLogs);
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

  private openViewerDialog(data: ViewableInterface): void {
    this.dialog.open(ViewerComponent, {
      data,
      autoFocus: false,
    });
  }
}
