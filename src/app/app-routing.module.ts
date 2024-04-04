import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { AgenceListComponent } from './components/agence/agence-list/agence-list.component';

const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: 'agence', component: AgenceListComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
