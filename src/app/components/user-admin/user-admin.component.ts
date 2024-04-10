import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { AgenceResponse } from 'src/app/model/agence/agence-response';
import { UserResponse } from 'src/app/model/user/user-response';
import { AgenceService } from 'src/app/service/agence/agence.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.css']
})
export class UserAdminComponent implements OnInit {

  userList: UserResponse[] = [];
  userRequestAdmin!: FormGroup;
  userRequestUpdateAdmin!:FormGroup;
  userRequestPhotoAdmin!:FormGroup;

  agences: any[] = [];
  userPhotoAdmin: any[] = [];
  pageNo = 0;
  pageSize = 10;
  totalPages = 0;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private agenceService: AgenceService,
  ) { }

  ngOnInit(): void
  {
    this.initForm();
    this.all();
    this.initFormUpdate();
    this.initFormPhotoProfil();
    this.fetchAgences();
  }

  initForm()
  {
    this.userRequestAdmin = this.formBuilder.group({
      id: [''],
      username: ['',[Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      firstname: ['',[Validators.required]],
      lastname: ['', [Validators.required]],
      address: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      role: ['', [Validators.required]],
      agenceId: ['', Validators.required],
      dateNaissance: ['', [Validators.required]],
      password: ['',  [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      multipartFiles: [[], [Validators.required]],
    },{
      validator: this.passwordMatchValidator
    });
    this.userPhotoAdmin = [];
  }

  fetchAgences() {
    this.agenceService.all(0, 100000).subscribe(
      (res: any[]) => {
        this.agences = res;
        console.log('Agences fetched successfully:', this.agences);
      },
      (error: any) => {
        console.error('Error while fetching agences:', error);
      }
    );
  }

  initFormUpdate()
  {
    this.userRequestUpdateAdmin = this.formBuilder.group({
      id: [''],
      username: ['',[Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      firstname: ['',[Validators.required]],
      lastname: ['', [Validators.required]],
      role: ['', [Validators.required]],
      agenceId: ['', [Validators.required]],
      address: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      dateNaissance: ['', [Validators.required]]
    });
  }

  initFormPhotoProfil()
  {
    this.userRequestPhotoAdmin= this.formBuilder.group({
      id: [''],
      multipartFiles: [[], [Validators.required]]
    });
  }

  onFileChange(event: Event)
  {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.userPhotoAdmin = Array.from(target.files);
    }
  }

  getImageSrc(file: File): any
  {
    const url = URL.createObjectURL(file);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  passwordMatchValidator(formGroup: FormGroup)
  {
    const password = formGroup.get('password')!.value;
    const confirmPassword = formGroup.get('confirmPassword')!.value;

    if (password !== confirmPassword)
    {
      formGroup.get('confirmPassword')!.setErrors({ mismatch: true });
    } else {
      formGroup.get('confirmPassword')!.setErrors(null);
    }
  }

  onSaveUserAdmin()
  {
    this.markFormGroupTouched(this.userRequestAdmin);

    if(this.userRequestAdmin.valid)
    {
      const formValue = this.userRequestAdmin.value;

      const formData = new FormData();
      formData.append('username', formValue.username);
      formData.append('email', formValue.email);
      formData.append('telephone', formValue.telephone);
      formData.append('firstname', formValue.firstname);

      formData.append('lastname', formValue.lastname);
      formData.append('address', formValue.address);
      formData.append('password', formValue.password);
      formData.append('role', formValue.role);
      formData.append('agenceId', formValue.agenceId);
      formData.append('dateNaissance', formValue.dateNaissance);

      for (let i = 0; i < this.userPhotoAdmin.length; i++) {
        formData.append('multipartFiles', this.userPhotoAdmin[i]);
      }

      this.userService.saveUserAdmin(formData).subscribe(
        (response) => {
          console.log('User saved successfully:', response);

          this.all();
          this.toastr.success("User created successfully.")
          this.userRequestAdmin.reset();
          this.userPhotoAdmin = [];
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
        }
      );
    }
  }

  onUpdateUserAdmin()
  {
    this.markFormGroupTouched(this.userRequestUpdateAdmin);

    console.log('onUpdateUserAdmin : ',this.userRequestUpdateAdmin);

    if(this.userRequestUpdateAdmin.valid)
    {
      this.userService.updateUserInfoByIdByAdmin(
        this.userRequestUpdateAdmin.value.id,
        this.userRequestUpdateAdmin.value
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

  onDeleteUserAdmin()
  {
    console.log('this.agenceRequest.value : ', this.userRequestAdmin.value);
    this.userService.deleteUser(
      this.userRequestAdmin.value.id
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

  markFormGroupTouched(formGroup: FormGroup)
  {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  previousPage()
  {
    if (this.pageNo > 0)
    {
      this.pageNo--;
      this.all();
    }
  }

  nextPage()
  {
    console.log(this.totalPages);
    console.log(this.pageNo);

    if (this.pageNo <= this.totalPages)
    {
      this.pageNo++;
      this.all();
    }
  }

  all()
  {
    this.userService.all(this.pageNo, this.pageSize).subscribe(
      (res: UserResponse[]) => {
        let tempList: any[] = [];

        res.forEach(agence => {
          this.agenceService.getById(agence.userDto.agenceId).subscribe((response) => {
            agence.agence = response;
            tempList.push(agence);
            console.log('non non non :::', tempList);
          });
        });

        this.userList = tempList;

        this.totalPages = Math.ceil(res.length / this.pageSize);
        console.log('Users fetched successfully:', res);
      },
      (error: any) => {
        console.error('Error while fetching users:', error);
      }
    );
  }

  editUserAdmin(user: UserResponse)
  {
    console.log(user);

    this.userRequestUpdateAdmin.patchValue({
      id: user.userDto.id,
      username: user.userDto.username,
      email: user.userDto.email,
      address: user.userDto.address,
      telephone: user.userDto.telephone,
      role: user.userDto.role,
      agenceId: user.userDto.agenceId,
      firstname: user.userDto.firstname,
      lastname: user.userDto.lastname,
      dateNaissance: user.userDto.dateNaissance
    });

    this.userPhotoAdmin = user.medias.map(media => media.uri);
    console.log("agenceImages après affectation :", this.userPhotoAdmin);
  }

  updatePhotoProfilByIdAdmin()
  {
    this.markFormGroupTouched(this.userRequestPhotoAdmin);

    const formData = new FormData();

    for (let i = 0; i < this.userPhotoAdmin.length; i++) {
      formData.append('multipartFiles', this.userPhotoAdmin[i]);
    }

    console.log('formdata :',formData);
    if(this.userRequestPhotoAdmin.valid)
    {
      this.userService.updatePhotoProfilById(this.userRequestPhotoAdmin.value.id, formData).subscribe((response)=>{
        console.log('update photo profil successfully', response);
        this.all();
        this.toastr.success("User photo profil updated successfully.");
      },(error) =>{
        console.log('error ', error);
        this.toastr.error("Something went wrong please try again.");
      });
    }
  }

  editPhotoProfilAdmin(user: UserResponse)
  {
    this.userRequestPhotoAdmin.patchValue({
      id: user.userDto.id
    });

    this.userPhotoAdmin = [];
  }

  deleteUserAdmin(user: UserResponse)
  {
    this.userRequestAdmin.patchValue({
      id: user.userDto.id
    });
  }
}
