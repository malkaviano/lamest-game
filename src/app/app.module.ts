import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from '../material/material.module';
import { InteractiveWidgetComponent } from './widgets/interactive/interactive.widget.component';
import { GamePageComponent } from './pages/game/game.page.component';
import { KeyValueDescriptionPanelComponent } from './panels/key-value-description/key-value-description.panel.component';
import { CharacterPageComponent } from './pages/character/character.page.component';
import { TextAreaPanelComponent } from './panels/text-area/text-area.panel.component';
import { WindowPanelComponent } from './panels/window/window.panel.component';
import { EquipmentWidgetComponent } from './widgets/equipment/equipment.widget.component';
import { EquippedWidgetComponent } from './widgets/equipped/equipped.widget.component';
import { GameLayoutComponent } from './layouts/game/game.layout.component';
import { InteractivePanelComponent } from './panels/interactive/interactive.panel.component';
import { InventoryPanelComponent } from './panels/inventory/inventory.panel.component';
import { ReaderDialogComponent } from './dialogs/reader/reader.dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    InteractiveWidgetComponent,
    TextAreaPanelComponent,
    GamePageComponent,
    KeyValueDescriptionPanelComponent,
    CharacterPageComponent,
    WindowPanelComponent,
    EquipmentWidgetComponent,
    EquippedWidgetComponent,
    GameLayoutComponent,
    InteractivePanelComponent,
    InventoryPanelComponent,
    ReaderDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
