import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPanelComponent } from './main-panel/main-panel.component';
import { CharacterPageComponent } from './pages/character-page/character-page.component';

const routes: Routes = [
  {
    path: 'character-generation',
    component: CharacterPageComponent,
    pathMatch: 'full',
  },
  { path: '', component: MainPanelComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
