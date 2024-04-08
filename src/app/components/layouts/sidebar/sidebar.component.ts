import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from 'src/app/service/authentification/authentification.service';
import { Subscription } from 'rxjs';
import { LoggerUser } from 'src/app/model/authentification/logged-user';
import { UserService } from 'src/app/service/user/user.service';
import { UserResponse } from 'src/app/model/user/user-response';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  userSub!:  Subscription;
  isAuthentication = false;
  isAdmin = false;
  isAgent = false;
  isPropreitaire= false;
  isSyndec = false;
  roles!: string[];
  loggedInfo!: UserResponse;

  constructor(
    private authService: AuthentificationService,
    private userService: UserService
  ) { }

  ngOnInit(): void
  {
    this.userSub = this.authService.user.subscribe(loggerUser => {
      this.isAuthentication = !!loggerUser;

      if(!this.isAuthentication)
      {
        this.initializeState();
      }else{
         this.setRole(loggerUser);
        if(loggerUser)
        {
          this.roles = loggerUser.roles;
        }
      }
    });

    this.loggedUser();
  }

  setRole(loggedUser:LoggerUser | null)
  {
    if(loggedUser?.roles.includes("ADMIN")) this.isAdmin = true;
    else if(loggedUser?.roles.includes("AGENT"))
    {
      this.isAgent = true;
    }else if(loggedUser?.roles.includes("PROPREITAIRE"))
    {
      this.isPropreitaire = true;
    }else if(loggedUser?.roles.includes("SYNDEC"))
    {
      this.isSyndec = true;
    }
  }

  loggedUser()
  {
    this.userService.loggedUser().subscribe((data) => {
      console.log('loggedUser info : ',data);
      this.loggedInfo = data;
    });
  }

  initializeState()
  {
    this.isAdmin = false;
    this.isAgent = false;
    this.isPropreitaire = false;
    this.isSyndec = false;
  }

  onLogout()
  {
    this.authService.logout();
  }
}
