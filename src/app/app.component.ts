import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from './service/authentification/authentification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Darkom';

  constructor(private authService: AuthentificationService)
  {}

  ngOnInit(): void
  {
    this.authService.autoLogin();
  }
}
