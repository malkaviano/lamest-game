import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { ViewableInterface } from '../../interfaces/viewable.interface';
import { CharacterValuesView } from '../../view-models/character-values.view';
import { KeyValueDescriptionView } from '../../view-models/key-value-description.view';
import { SceneEntity } from '@entities/scene.entity';

@Component({
  selector: 'app-game-page',
  templateUrl: './game.page.component.html',
  styleUrls: ['./game.page.component.css'],
  providers: [WithSubscriptionHelper],
})
export class GamePageComponent implements OnInit, OnDestroy {
  private readonly gameLogs: string[];

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

        this.wearing = character.armorWearing;

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

  public informDodgeOption(option: { dodge: boolean }): void {
    this.gameLoopService.actorDodge(option.dodge);
  }

  public get logs(): ArrayView<string> {
    return ArrayView.fromArray(this.gameLogs);
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
}
