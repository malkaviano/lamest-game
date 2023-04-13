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
import { TextAreaWidgetComponent } from './widgets/text-area/text-area.widget.component';
import { WindowWidgetComponent } from './widgets/window/window.widget.component';
import { EquipmentWidgetComponent } from './widgets/equipment/equipment.widget.component';
import { GameLayoutComponent } from './layouts/game/game.layout.component';
import { InteractivePanelComponent } from './panels/interactive/interactive.panel.component';
import { InventoryPanelComponent } from './panels/inventory/inventory.panel.component';
import { ReaderDialogComponent } from './dialogs/reader/reader.dialog.component';
import { StatusBarWidgetComponent } from './widgets/status-bar/status-bar.widget.component';

@NgModule({
  declarations: [
    AppComponent,
    InteractiveWidgetComponent,
    TextAreaWidgetComponent,
    GamePageComponent,
    KeyValueDescriptionPanelComponent,
    CharacterPageComponent,
    WindowWidgetComponent,
    EquipmentWidgetComponent,
    GameLayoutComponent,
    InteractivePanelComponent,
    InventoryPanelComponent,
    ReaderDialogComponent,
    StatusBarWidgetComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
