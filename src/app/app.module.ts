import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from "@angular/material/dialog";
import { SidebarComponent } from './components/layouts/sidebar/sidebar.component';
import { TopbarComponent } from './components/layouts/topbar/topbar.component';
import { AgenceListComponent } from './components/agence/agence-list/agence-list.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { FooterComponent } from './components/layouts/footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { ToastrModule } from 'ngx-toastr';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    TopbarComponent,
    FooterComponent,
    DashboardComponent,
    AgenceListComponent,
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
