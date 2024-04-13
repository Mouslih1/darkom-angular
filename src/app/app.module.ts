import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from "@angular/material/dialog";
import { AgenceListComponent } from './components/agence/agence-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { ToastrModule } from 'ngx-toastr';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
import { AuthentificationComponent } from './components/authentification/authentification.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { FooterComponent } from './components/layouts/footer/footer.component';
import { SidebarComponent } from './components/layouts/sidebar/sidebar.component';
import { TopbarComponent } from './components/layouts/topbar/topbar.component';
import { AuthentificationInterceptorService } from './service/authentification/authentification.interceptor.service';
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
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SetPasswordComponent } from './components/set-password/set-password.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    TopbarComponent,
    FooterComponent,
    DashboardComponent,
    AgenceListComponent,
    AuthentificationComponent,
    AppLayoutComponent,
    NotFoundComponent,
    ProfilComponent,
    UserComponent,
    UserAdminComponent,
    ImmeubleComponent,
    AppartmentComponent,
    ContratComponent,
    EvenementComponent,
    PlainteComponent,
    TravauxComponent,
    PaymentContratLoyerComponent,
    PaymentContratVenteComponent,
    PaymentSyndecComponent,
    ForgotPasswordComponent,
    SetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,

  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthentificationInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
