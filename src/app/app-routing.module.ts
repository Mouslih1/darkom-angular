import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AgenceListComponent } from './components/agence/agence-list.component';
import { AuthentificationComponent } from './components/authentification/authentification.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ProfilComponent } from './components/profil/profil.component';
import { UserComponent } from './components/user/user.component';
import { UserAdminComponent } from './components/user-admin/user-admin.component';
import { ImmeubleComponent } from './components/immeuble/immeuble.component';
import { AppartmentComponent } from './components/appartment/appartment.component';
import { ContratComponent } from './components/contrat/contrat.component';
import { EvenementComponent } from './components/evenement/evenement.component';
import { PlainteComponent } from './components/plainte/plainte.component';
import { TravauxComponent } from './components/travaux/travaux.component';

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
      { path: 'users', component: UserComponent},
      { path: 'users-admin', component: UserAdminComponent},
      { path: 'immeubles', component: ImmeubleComponent},
      { path: 'appartements', component: AppartmentComponent},
      { path: 'contracts', component: ContratComponent},
      { path: 'evenements', component: EvenementComponent},
      { path: 'plaintes', component: PlainteComponent},
      { path: 'travaux', component: TravauxComponent},
      { path: 'profile', component: ProfilComponent}
    ]
  },

  { path: '**', redirectTo: 'not-found', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
