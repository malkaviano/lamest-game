import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from '../material/material.module';
import { InteractiveWidgetComponent } from './widgets/interactive/interactive.widget.component';
import { GamePageComponent } from './pages/game/game.page.component';
import { KeyValueDescriptionPanelComponent } from './panels/key-value-description/key-value-description.panel.component';
import { TextAreaWidgetComponent } from './widgets/text-area/text-area.widget.component';
import { WindowWidgetComponent } from './widgets/window/window.widget.component';
import { EquipmentWidgetComponent } from './widgets/inventory-equipment/inventory-equipment.widget.component';
import { GameLayoutComponent } from './layouts/game/game.layout.component';
import { InteractivePanelComponent } from './panels/interactive/interactive.panel.component';
import { ReaderDialogComponent } from './dialogs/reader/reader.dialog.component';
import { StatusBarPanelComponent } from './panels/status-bar/status-bar.panel.component';
import { SheetPanelComponent } from './panels/sheet/sheet.panel.component';
import { ProvidersModule } from './providers/provider.module';
import { ViewerComponent } from './dialogs/viewer/viewer.dialog.component';
import { ImageViewerComponent } from './widgets/image-viewer/image-viewer.widget.component';
import { EquippedWidgetComponent } from './widgets/equipped/equipped.widget.component';
import { ActionWidgetComponent } from './widgets/action/action.widget.component';
import { FloatingNumberWidgetComponent } from './widgets/floating-number/floating-number.widget.component';
import { AnimatedProgressBarWidgetComponent } from './widgets/animated-progress-bar/animated-progress-bar.widget.component';
import { CombatTimelinePanelComponent } from './panels/combat-timeline/combat-timeline.panel.component';

@NgModule({
  declarations: [
    AppComponent,
    InteractiveWidgetComponent,
    TextAreaWidgetComponent,
    GamePageComponent,
    KeyValueDescriptionPanelComponent,
    WindowWidgetComponent,
    EquipmentWidgetComponent,
    GameLayoutComponent,
    InteractivePanelComponent,
    ReaderDialogComponent,
    StatusBarPanelComponent,
    SheetPanelComponent,
    ViewerComponent,
    ImageViewerComponent,
    EquippedWidgetComponent,
    ActionWidgetComponent,
    FloatingNumberWidgetComponent,
    AnimatedProgressBarWidgetComponent,
    CombatTimelinePanelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ProvidersModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
      maxOpened: 10,
      autoDismiss: true,
      closeButton: false,
      progressBar: true,
      enableHtml: true,
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
