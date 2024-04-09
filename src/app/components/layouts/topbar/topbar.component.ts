import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Subscription } from 'rxjs';
import { NotificationData } from 'src/app/model/notification/notification';
import { UserResponse } from 'src/app/model/user/user-response';
import { AuthentificationService } from 'src/app/service/authentification/authentification.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit, OnDestroy {

  currentUser!: number;
  userSub!: Subscription;
  notificationsSub!: Subscription;
  notificationsList: any[] = [];
  loggedInfo!: UserResponse;
  dataSubscription!: Subscription;
  userCreerNotif!: UserResponse;

  constructor(
    private db: AngularFireDatabase,
    private authService: AuthentificationService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.triggerGetNewPhotoProfil();
    this.getNotificationByloggedUser();
    this.loggedUser();
  }

  getNotificationByloggedUser() {
    this.userSub = this.authService.user.subscribe(loggerUser => {
      if (loggerUser && loggerUser.id) {
        this.currentUser = loggerUser.id;
        this.notificationsSub = this.db.list('/notifications', ref => ref.orderByChild('receivedId').equalTo(this.currentUser)).snapshotChanges().subscribe(notif => {
          console.log('notification avec key : ', notif);
          this.notificationsList = [];
          notif.forEach(item => {
            const notificationKey = item.key;
            if (notificationKey) {
              const notificationData = item.payload.val() as NotificationData;
              const date = new Date(notificationData.createdAt);

              const notification: NotificationData = {
                key: notificationKey,
                message: notificationData.message,
                relatedId: notificationData.relatedId,
                receivedId: notificationData.receivedId,
                senderUsername: notificationData.senderUsername,
                userCreateNotification: notificationData.userCreateNotification,
                agenceId: notificationData.agenceId,
                createdAt: date.toLocaleString(),
                seen: notificationData.seen,
                profileImageUrl: null
              };

              console.log("notification user id :", notification.userCreateNotification);

              this.userService.getUserbyId(notification.userCreateNotification).subscribe((response) => {
                notification.profileImageUrl = response.medias?.length > 0 ? response.medias[0].uri : null;
              });

              this.notificationsList.push(notification);

              console.log('liste of notification : ', this.notificationsList);
            }
          });
        });
      }
    });
  }

  triggerGetNewPhotoProfil() {
    this.dataSubscription = this.userService.loggedUserInfo$.subscribe((data) => {
      console.log('loggedUser info : ', data);
      this.loggedInfo = data;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  loggedUser() {
    this.userService.loggedUser().subscribe((data) => {
      console.log('loggedUser info : ', data);
      this.loggedInfo = data;
    });
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }
}
