import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserResponse } from 'src/app/model/user/user-response';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  loggedInfo!: UserResponse;
  selectedImage: any[] = [];

  constructor(private userService: UserService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void
  {
    this.loggedUser();
  }

  loggedUser()
  {
    this.userService.loggedUser().subscribe((data) => {
      console.log('loggedUser info : ',data);
      this.loggedInfo = data;
    });
  }

  onFileChange(event: Event)
  {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedImage = Array.from(target.files);
    }

    console.log(this.selectedImage);

  }

  getImageSrc(file: File): any {
    const url = URL.createObjectURL(file);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }


}
