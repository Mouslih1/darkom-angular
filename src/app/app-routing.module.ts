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
import { PaymentContratLoyerComponent } from './components/payment-contrat-loyer/payment-contrat-loyer.component';
import { PaymentContratVenteComponent } from './components/payment-contrat-vente/payment-contrat-vente.component';
import { PaymentSyndecComponent } from './components/payment-syndec/payment-syndec.component';
import { AuthentificationGuardService } from './service/authentification/authentification.guard.service';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

const routes: Routes = [
  { path: 'login/forgot-password', component: ForgotPasswordComponent},
  { path: 'login', component: AuthentificationComponent},
  { path: 'not-found', component: NotFoundComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full'},

  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthentificationGuardService], data : { role:['ADMIN', 'AGENT']}},
      { path: 'agences', component: AgenceListComponent, canActivate: [AuthentificationGuardService], data : { role:['ADMIN']}},
      { path: 'users', component: UserComponent, canActivate: [AuthentificationGuardService], data : { role:['AGENT']}},
      { path: 'users-admin', component: UserAdminComponent, canActivate: [AuthentificationGuardService], data : { role:['ADMIN']}},
      { path: 'immeubles', component: ImmeubleComponent, canActivate: [AuthentificationGuardService], data : { role:['AGENT']}},
      { path: 'appartements', component: AppartmentComponent, canActivate: [AuthentificationGuardService], data : { role:['AGENT']}},
      { path: 'contracts', component: ContratComponent, canActivate: [AuthentificationGuardService], data : { role:['AGENT']}},
      { path: 'evenements', component: EvenementComponent,canActivate: [AuthentificationGuardService], data : { role:['PROPRIETAIRE', 'SYNDEC']}},
      { path: 'plaintes', component: PlainteComponent , canActivate: [AuthentificationGuardService], data : { role:['PROPRIETAIRE', 'SYNDEC']}},
      { path: 'travaux', component: TravauxComponent, canActivate: [AuthentificationGuardService], data : { role:['SYNDEC']}},
      { path: 'payment-contracts-loyer', component: PaymentContratLoyerComponent, canActivate: [AuthentificationGuardService], data : { role:['AGENT']}},
      { path: 'payment-contracts-vente', component: PaymentContratVenteComponent, canActivate: [AuthentificationGuardService], data : { role:['AGENT']}},
      { path: 'payment-syndec', component: PaymentSyndecComponent, canActivate: [AuthentificationGuardService], data : { role:['PROPRIETAIRE', 'SYNDEC']}},
      { path: 'profile', component: ProfilComponent, canActivate: [AuthentificationGuardService], data : { role:['PROPRIETAIRE', 'SYNDEC', 'ADMIN', 'AGENT']}}
    ]
  },

  { path: '**', redirectTo: 'not-found', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
