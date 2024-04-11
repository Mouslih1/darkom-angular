import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UserResponse } from 'src/app/model/user/user-response';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userList: UserResponse[] = [];
  userRequest!: FormGroup;
  userRequestUpdate!: FormGroup;
  userRequestPhoto!: FormGroup;

  userPhoto: any[] = [];
  pageNo = 0;
  pageSize = 10;
  totalPages = 0;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.all();
    this.initFormUpdate();
    this.initFormPhotoProfil();
  }

  initForm() {
    this.userRequest = this.formBuilder.group({
      id: [''],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      address: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      role: ['', [Validators.required]],
      dateNaissance: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      multipartFiles: [[], [Validators.required]],
    }, {
      validator: this.passwordMatchValidator
    });
    this.userPhoto = [];
  }

  initFormUpdate() {
    this.userRequestUpdate = this.formBuilder.group({
      id: [''],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      role: ['', [Validators.required]],
      address: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      dateNaissance: ['', [Validators.required]]
    });
  }

  initFormPhotoProfil() {
    this.userRequestPhoto = this.formBuilder.group({
      id: [''],
      multipartFiles: [[], [Validators.required]]
    });
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.userPhoto = Array.from(target.files);
    }
  }

  getImageSrc(file: File): any {
    const url = URL.createObjectURL(file);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')!.value;
    const confirmPassword = formGroup.get('confirmPassword')!.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')!.setErrors({ mismatch: true });
    } else {
      formGroup.get('confirmPassword')!.setErrors(null);
    }
  }

  onSaveUser() {
    this.markFormGroupTouched(this.userRequest);

    console.log('this.userRequest.value :',this.userRequest.value);

    if (this.userRequest.valid) {
      const formValue = this.userRequest.value;

      const formData = new FormData();
      formData.append('username', formValue.username);
      formData.append('email', formValue.email);
      formData.append('telephone', formValue.telephone);
      formData.append('firstname', formValue.firstname);

      formData.append('lastname', formValue.lastname);
      formData.append('address', formValue.address);
      formData.append('password', formValue.password);
      formData.append('role', formValue.role);
      formData.append('dateNaissance', formValue.dateNaissance);

      for (let i = 0; i < this.userPhoto.length; i++) {
        formData.append('multipartFiles', this.userPhoto[i]);
      }

      this.userService.saveUser(formData).subscribe(
        (response) => {
          console.log('User saved successfully:', response);

          this.all();
          this.toastr.success("User created successfully.")
          this.userRequest.reset();
          this.userPhoto = [];
        },
        (error) => {
          console.log('errerrer',error.error);

          if (error && error.error && error.error.includes("Violation de contrainte unique : cette username existe déjà.")) {
            this.toastr.error('This username already exists.');
          }else if(error && error.error && error.error.includes("Violation de contrainte unique : cette adresse e-mail est déjà utilisée."))
          {
            this.toastr.error('This email already exists.');
          }
          else {
            this.toastr.error('Something went wrong, please try again.');
          }
        }
      );
    }
  }

  onUpdateUser() {
    this.markFormGroupTouched(this.userRequestUpdate);

    console.log('valid update user : ', this.userRequestUpdate);

    this.toastr.success("vavavavava");

    if (this.userRequestUpdate.valid) {
      this.userService.updateUserInfoById(
        this.userRequestUpdate.value.id,
        this.userRequestUpdate.value
      ).subscribe((response) => {
        this.all();
        console.log('User updated successfully:', response);
        this.toastr.success("User info updated successfully.");
      },
        (error) => {
          if (error && error.error && error.error.includes("Violation de contrainte unique : cette username existe déjà.")) {
            this.toastr.error('This username already exists.');
          }else if(error && error.error && error.error.includes("Violation de contrainte unique : cette adresse e-mail est déjà utilisée."))
          {
            this.toastr.error('This email already exists.');
          }
          else {
            this.toastr.error('Something went wrong, please try again.');
          }
        });
    }
  }

  onDeleteUser() {
    console.log('this.agenceRequest.value : ', this.userRequest.value);
    this.userService.deleteUser(
      this.userRequest.value.id
    ).subscribe((response) => {
      console.log('User deleted successfully:', response);
      this.all();
      this.toastr.success("User deleted successfully.");
    },
      (error) => {
        console.error('Error while delete agence:', error);
        this.toastr.error("Something went wrong please try again.")
      });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  previousPage() {
    if (this.pageNo > 0) {
      this.pageNo--;
      this.all();
    }
  }

  nextPage() {
    console.log(this.totalPages);
    console.log(this.pageNo);

    if (this.pageNo <= this.totalPages) {
      this.pageNo++;
      this.all();
    }
  }

  all() {
    this.userService.allByAgence(this.pageNo, this.pageSize).subscribe(
      (res: UserResponse[]) => {
        this.userList = res;
        this.totalPages = Math.ceil(res.length / this.pageSize);

        console.log('Users fetched successfully:', res);
      },
      (error: any) => {
        console.error('Error while fetching users:', error);
      }
    );
  }

  editUser(user: UserResponse)
  {
    console.log(user);

    this.userRequestUpdate.patchValue({
      id: user.userDto.id,
      username: user.userDto.username,
      email: user.userDto.email,
      address: user.userDto.address,
      telephone: user.userDto.telephone,
      role: user.userDto.role,
      firstname: user.userDto.firstname,
      lastname: user.userDto.lastname,
      dateNaissance: user.userDto.dateNaissance
    });

    console.log('this userrequestupdate : ', this.userRequestUpdate);

    this.userPhoto = user.medias.map(media => media.uri);
    console.log("agenceImages après affectation :", this.userPhoto);
  }

  updatePhotoProfilById()
  {
    this.markFormGroupTouched(this.userRequestPhoto);

    const formData = new FormData();

    for (let i = 0; i < this.userPhoto.length; i++) {
      formData.append('multipartFiles', this.userPhoto[i]);
    }

    console.log('formdata :', formData);
    if (this.userRequestPhoto.valid) {
      this.userService.updatePhotoProfilById(this.userRequestPhoto.value.id, formData).subscribe((response) => {
        console.log('update photo profil successfully', response);
        this.all();
        this.toastr.success("User photo profil updated successfully.");
      }, (error) => {
        if (error && error.error && error.error.includes("Violation de contrainte unique : cette username existe déjà.")) {
          this.toastr.error('This username already exists.');
        } else {
          this.toastr.error('Something went wrong, please try again.');
        }
      });
    }
  }

  editPhotoProfil(user: UserResponse) {
    this.userRequestPhoto.patchValue({
      id: user.userDto.id
    });

    this.userPhoto = [];
  }

  deleteUser(user: UserResponse) {
    this.userRequest.patchValue({
      id: user.userDto.id
    });
  }
}
