import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AgenceListComponent } from './components/agence/agence-list.component';
import { AuthentificationComponent } from './components/authentification/authentification.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ProfilComponent } from './components/profil/profil.component';
import { UserComponent } from './components/user/user.component';

const routes: Routes = [
  { path: 'login', component: AuthentificationComponent},
  { path: 'not-found', component: NotFoundComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full'},

  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent},
      { path: 'agences', component: AgenceListComponent},
      { path: 'profile', component: ProfilComponent},
      { path: 'users', component: UserComponent}
    ]
  },

  { path: '**', redirectTo: 'not-found', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
