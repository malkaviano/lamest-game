import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GamePage } from './pages/game/game.page';
import { CharacterPage } from './pages/character/character.page';

const routes: Routes = [
  {
    path: 'random-character-generation',
    component: CharacterPage,
    pathMatch: 'full',
  },
  { path: '', component: GamePage, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
