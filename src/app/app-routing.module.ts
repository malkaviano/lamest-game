import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GamePanelComponent } from './panels/game-panel/game-panel.component';
import { CharacterPageComponent } from './pages/character-page/character-page.component';

const routes: Routes = [
  {
    path: 'random-character-generation',
    component: CharacterPageComponent,
    pathMatch: 'full',
  },
  { path: '', component: GamePanelComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
