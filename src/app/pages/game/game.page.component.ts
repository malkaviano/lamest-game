import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { SceneDefinition } from '../../../core/definitions/scene.definition';
import { CharacterValuesView } from '../../../core/view-models/character-values.view';
import { ActionableItemView } from '../../../core/view-models/actionable-item.view';
import { GameItemDefinition } from '../../../core/definitions/game-item.definition';
import { CharacterStatusView } from '../../../core/view-models/character-status.view';
import { GameLoopService } from '../../services/game-loop.service';
import { ArrayView } from '../../../core/view-models/array.view';
import { KeyValueDescriptionView } from '../../../core/view-models/key-value-description.view';
import { GameStringsStore } from '../../../stores/game-strings.store';
import { ActionableEvent } from '../../../core/events/actionable.event';
import { LogMessageDefinition } from '../../../core/definitions/log-message.definition';
import { ReadableInterface } from '../../../core/interfaces/readable.interface';
import { ReaderDialogComponent } from '../../dialogs/reader/reader.dialog.component';
import { FormatterHelperService } from '../../helpers/formatter.helper.service';
import { WithSubscriptionHelper } from '../../helpers/with-subscription.helper';

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
      this.gameLoopService.events.playerChanged$.subscribe((character) => {
        this.characterValues =
          this.formatterHelperService.characterToKeyValueDescription(character);

        this.equipped = character.weaponEquipped;

        const hp = KeyValueDescriptionView.create(
          'HP',
          `${this.characterValues.derivedAttributes.items[0].value}/` +
            `${this.characterValues.derivedAttributes.items[2].value}`,
          GameStringsStore.descriptions['HP']
        );

        const ep = KeyValueDescriptionView.create(
          'EP',
          `${this.characterValues.derivedAttributes.items[1].value}/` +
            `${this.characterValues.derivedAttributes.items[3].value}`,
          GameStringsStore.descriptions['EP']
        );

        this.characterStatus = CharacterStatusView.create(
          ArrayView.create([
            hp,
            ep,
            this.characterValues.derivedAttributes.items[4],
          ]),
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
