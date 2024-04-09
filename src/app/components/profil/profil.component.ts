import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { UserResponse } from 'src/app/model/user/user-response';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit, OnDestroy{

  loggedInfo!: UserResponse;
  selectedImage: any[] = [];
  userDataPhoto!: FormGroup;
  userData!: FormGroup;
  userPassword!: FormGroup;
  dataSubscription!: Subscription;

  constructor(
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void
  {
    this.triggerGetNewPhotoProfil();
    this.loggedUser();
    this.initFormPhoto();
    this.initForm();
    this.initPasswordForm();
  }

  triggerGetNewPhotoProfil()
  {
    this.dataSubscription = this.userService.loggedUserInfo$.subscribe((data) => {
      console.log('loggedUser info : ', data);
      this.loggedInfo = data;
    });
  }

  initFormPhoto()
  {
    this.userDataPhoto = this.formBuilder.group({
      multipartFiles: [[], [Validators.required]],
    });
  }

  initForm()
  {
    this.userData = this.formBuilder.group({
      username: [,[Validators.required]],
      email: [, [Validators.required, Validators.email]],
      firstname: [,[Validators.required]],
      lastname: [, [Validators.required]],
      address: [, [Validators.required]],
      telephone: [, [Validators.required]],
      dateNaissance: [, [Validators.required]],
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
    this.markFormGroupTouched(this.userDataPhoto);

    const formData = new FormData();

    for (let i = 0; i < this.selectedImage.length; i++) {
      formData.append('multipartFiles', this.selectedImage[i]);
    }

    if(this.userDataPhoto.valid)
    {
      this.userService.updatePhotoProfil(formData).subscribe(
        (response) => {
          console.log('User photo profil updated successfully:', response);
          this.toastr.success("User photo profil updated successfully.")
          this.selectedImage = [];
        },
        (error) => {
          console.error('Error while saving agence:', error);
          this.toastr.error("Something went wrong please try again.")
        });
    }else{
      this.toastr.error("Photo profile is required.")
    }
  }

  updateInfo()
  {
    this.markFormGroupTouched(this.userData);

    console.log('user data : ', this.userData);

    if(this.userData.valid)
    {
      this.userService.updateUserInfo(this.userData.value).subscribe(
      (response) => {
        console.log('Information of your account updated successfully:', response);
        this.toastr.success("Information of your account updated successfully.")
        this.userData.reset();
      },
      (error) => {
        console.error('Error while saving agence:', error);
        this.toastr.error("Something went wrong please try again.")
      });
    }
  }

  updatePassword()
  {
    this.markFormGroupTouched(this.userPassword);


    console.log('user data password : ', this.userPassword);

    if(this.userPassword.valid)
    {
      this.userService.updateUserPassword(this.userPassword.value).subscribe(
      (response) => {
        console.log('Your password updated successfully:', response);
        this.toastr.success("Your password updated successfully.")
        this.userPassword.reset();
      },
      (error) => {
        console.error('Error while saving password:', error);
        this.toastr.error("Something went wrong please try again.")
      });
    }
  }

  markFormGroupTouched(formGroup: FormGroup)
  {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  ngOnDestroy(): void
  {
    this.dataSubscription.unsubscribe();
  }
}
