import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GamePageComponent } from './pages/game/game.page.component';
import { CharacterPageComponent } from './pages/character/character.page.component';

const routes: Routes = [
  {
    path: 'random-character-generation',
    component: CharacterPageComponent,
    pathMatch: 'full',
  },
  { path: '', component: GamePageComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
