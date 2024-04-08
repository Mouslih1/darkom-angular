import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
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
  userDataPhoto!: FormGroup;
  userData!: FormGroup;
  userPassword!: FormGroup;

  constructor(
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void
  {
    this.loggedUser();
    this.initFormPhoto();
    this.initForm();
    this.initPasswordForm();
  }

  initFormPhoto()
  {
    this.userDataPhoto = this.formBuilder.group({
      id: ['', [Validators.required]],
      multipartFiles: [[], [Validators.required]]
    });
  }

  initForm()
  {
    this.userData = this.formBuilder.group({
      id: [''],
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      address: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      dateNaissance: ['', [Validators.required]],
    });
  }

  initPasswordForm()
  {
    this.userPassword = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(formGroup: FormGroup)
  {
    const newPassword = formGroup.get('newPassword')!.value;
    const confirmPassword = formGroup.get('confirmPassword')!.value;

    if (newPassword !== confirmPassword)
    {
      formGroup.get('confirmPassword')!.setErrors({ mismatch: true });
    } else {
      formGroup.get('confirmPassword')!.setErrors(null);
    }
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
  }

  getImageSrc(file: File): any
  {
    const url = URL.createObjectURL(file);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  updateUserPhoto()
  {
    const formData = new FormData();

    for (let i = 0; i < this.selectedImage.length; i++) {
      formData.append('multipartFiles', this.selectedImage[i]);
    }

    if(this.userDataPhoto.valid)
    {
      // this.userService.updatePhotoProfilLogo(formData).subscribe(
      //   (response) => {
      //     console.log('Agence saved successfully:', response);
      //     this.toastr.success("User photo profil updated successfully.")
      //     this.userDataPhoto.reset();
      //   },
      //   (error) => {
      //     console.error('Error while saving agence:', error);
      //     this.toastr.error("Something went wrong please try again.")
      //   });
      console.log(this.userDataPhoto.value.multipartFiles[0]);

    }
  }
}
