import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from '../material/material.module';
import { InteractiveComponent } from './interactive/interactive.component';
import { MainTextComponent } from './main-text/main-text.component';
import { MainPanelComponent } from './main-panel/main-panel.component';
import { UniformPanelComponent } from './panels/uniform-panel/uniform-panel.component';
import { CharacterComponent } from './pages/character/character.component';
import { KeyValueComponent } from './widgets/key-value/key-value.component';

@NgModule({
  declarations: [
    AppComponent,
    InteractiveComponent,
    MainTextComponent,
    MainPanelComponent,
    UniformPanelComponent,
    CharacterComponent,
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
