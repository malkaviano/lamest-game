import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from '../material/material.module';
import { InteractiveWidget } from './widgets/interactive/interactive.widget';
import { GamePage } from './pages/game/game.page';
import { KeyValuePanel } from './panels/key-value/key-value.panel';
import { CharacterPage } from './pages/character/character.page';
import { TextAreaWindow } from './windows/text-area/text-area.window';
import { KeyValueWindow } from './windows/key-value/key-value.window';
import { EquipmentWidget } from './widgets/equipment/equipment.widget';
import { EquippedWidget } from './widgets/equipped/equipped.widget';
import { GameLayout } from './layouts/game/game.layout';
import { InteractivePanelComponent } from './panels/interactive/interactive.panel';
import { InventoryPanel } from './panels/inventory/inventory.panel';

@NgModule({
  declarations: [
    AppComponent,
    InteractiveWidget,
    TextAreaWindow,
    GamePage,
    KeyValuePanel,
    CharacterPage,
    KeyValueWindow,
    EquipmentWidget,
    EquippedWidget,
    GameLayout,
    InteractivePanelComponent,
    InventoryPanel,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
