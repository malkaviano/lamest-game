import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ActionableItemView } from '../../views/actionable-item.view';
import { CharacterValuesView } from '../../views/character-values.view';
import { GameItemDefinition } from '../../definitions/game-item.definition';
import { SceneDefinition } from '../../definitions/scene.definition';
import { ActionableEvent } from '../../events/actionable.event';
import { WithSubscriptionHelper } from '../../helpers/with-subscription.helper';
import { GameBridgeService } from '../../services/game-bridge.service';
import { ArrayView } from '../../views/array.view';
import { FormatterHelperService } from '../../helpers/formatter.helper.service';
import { ReaderDialogComponent } from '../../dialogs/reader.dialog/reader.dialog.component';
import { DocumentOpenedInterface } from '../../interfaces/reader-dialog.interface';

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

  constructor(
    private readonly gameManagerService: GameBridgeService,
    private readonly withSubscriptionHelper: WithSubscriptionHelper,
    private readonly formatterHelperService: FormatterHelperService,
    private readonly dialog: MatDialog
  ) {
    this.gameLogs = [];

    this.inventory = [];

    this.characterValues = CharacterValuesView.create(
      ArrayView.create([]),
      ArrayView.create([]),
      ArrayView.create([]),
      ArrayView.create([])
    );

    this.scene = new SceneDefinition(
      ArrayView.create([]),
      ArrayView.create([])
    );
  }

  ngOnDestroy(): void {
    this.withSubscriptionHelper.unsubscribeAll();
  }

  ngOnInit(): void {
    this.withSubscriptionHelper.addSubscription(
      this.gameManagerService.events.characterChanged$.subscribe(
        (character) => {
          this.characterValues =
            this.formatterHelperService.characterToKeyValueDescription(
              character
            );
          this.equipped = character.weaponEquipped;
        }
      )
    );

    this.withSubscriptionHelper.addSubscription(
      this.gameManagerService.events.sceneChanged$.subscribe(
        (scene) => (this.scene = scene)
      )
    );

    this.withSubscriptionHelper.addSubscription(
      this.gameManagerService.events.actionLogged$.subscribe((log) => {
        this.gameLogs.unshift(log.toString());
      })
    );

    this.withSubscriptionHelper.addSubscription(
      this.gameManagerService.events.playerInventory$.subscribe((inventory) => {
        this.inventory = inventory.items;
      })
    );

    this.withSubscriptionHelper.addSubscription(
      this.gameManagerService.events.documentOpened$.subscribe(
        (documentText) => {
          this.openReaderDialog(documentText);
        }
      )
    );
  }

  informActionSelected(action: ActionableEvent): void {
    this.gameManagerService.actionableReceived(action);
  }

  public get logs(): ArrayView<string> {
    return ArrayView.create(this.gameLogs);
  }

  private openReaderDialog(data: DocumentOpenedInterface): void {
    this.dialog.open(ReaderDialogComponent, {
      data,
    });
  }
}
