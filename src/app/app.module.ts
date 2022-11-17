import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from '../material/material.module';
import { InteractiveComponent } from './widgets/interactive/interactive.component';
import { TextBoxComponent } from './widgets/text-box/text-box.component';
import { GamePanelComponent } from './panels/game-panel/game-panel.component';
import { KeyValuePanelComponent } from './panels/key-value-panel/key-value-panel.component';
import { CharacterPageComponent } from './pages/character-page/character-page.component';
import { KeyValueComponent } from './widgets/key-value/key-value.component';

@NgModule({
  declarations: [
    AppComponent,
    InteractiveComponent,
    TextBoxComponent,
    GamePanelComponent,
    KeyValuePanelComponent,
    CharacterPageComponent,
    KeyValueComponent,
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
