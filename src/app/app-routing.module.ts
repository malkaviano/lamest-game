import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPanelComponent } from './main-panel/main-panel.component';
import { CharacterComponent } from './pages/character/character.component';

const routes: Routes = [
  {
    path: 'character-generation',
    component: CharacterComponent,
    pathMatch: 'full',
  },
  { path: '', component: MainPanelComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
