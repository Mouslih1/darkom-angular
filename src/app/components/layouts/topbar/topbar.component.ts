import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  //currentUser: string; // Stocke l'ID de l'utilisateur connecté

  constructor(private db: AngularFireDatabase) { }

  ngOnInit(): void
  {
    this.db.object('notifications').valueChanges().subscribe(data => {
      console.log(data);
      // traitment pour affiche notif by id user connecter
    });

    // Récupérer l'utilisateur connecté
    // this.auth.user.subscribe(user => {
    //   if (user) {
    //     this.currentUser = user.uid;
    //     // Écouter les changements dans le nœud 'notifications' filtrés par receivedId
    //     this.notifications$ = this.db.list('/notifications', ref => ref.orderByChild('receivedId').equalTo(this.currentUser)).valueChanges();
    //   }
    // });

  }
}


