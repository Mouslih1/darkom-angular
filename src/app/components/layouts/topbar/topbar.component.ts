import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Subscription } from 'rxjs';
import { UserResponse } from 'src/app/model/user/user-response';
import { AuthentificationService } from 'src/app/service/authentification/authentification.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  currentUser!: number;
  userSub!:  Subscription;
  notificationsSub!: Subscription;
  notificationsList: any[] = [];
  loggedInfo!: UserResponse;

  constructor(
    private db: AngularFireDatabase,
    private authService: AuthentificationService,
    private userService: UserService
  ) { }

  ngOnInit(): void
  {
    this.userSub = this.authService.user.subscribe(loggerUser => {
      if (loggerUser) {
        this.currentUser = loggerUser.id;
        this.notificationsSub = this.db.list('/notifications', ref => ref.orderByChild('receivedId').equalTo(this.currentUser)).snapshotChanges().subscribe(notif => {
          console.log('notification avec key : ', notif);
          this.notificationsList = [];
          notif.forEach(item => {
            const notificationKey = item.key;
            const notificationData = item.payload.val();
            this.notificationsList.push({ key: notificationKey, data: notificationData });
            console.log('liste of notification : ' , this.notificationsList);
          });
        });
      }
    });

    this.loggedUser();
  }

  onLogout()
  {
    this.authService.logout();
  }

  loggedUser()
  {
    this.userService.loggedUser().subscribe((data) => {
      console.log('loggedUser info : ',data);
      this.loggedInfo = data;
    });
  }
}
