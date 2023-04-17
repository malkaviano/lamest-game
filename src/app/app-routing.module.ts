import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GamePageComponent } from './pages/game/game.page.component';

const routes: Routes = [
  { path: '', component: GamePageComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
