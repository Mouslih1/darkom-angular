import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css']
})
export class SetPasswordComponent implements OnInit {

  setPasswordForm!: FormGroup;
  email!: string;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ) { }


  ngOnInit(): void
  {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
    this.initPasswordForm();
  }

  initPasswordForm()
  {
    this.setPasswordForm = this.formBuilder.group({
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

  setPassword()
  {
    this.markFormGroupTouched(this.setPasswordForm);

    console.log('email : ' ,this.email);
    console.log('new password :', this.setPasswordForm.value.newPassword);

    if(this.setPasswordForm.valid)
    {
      this.userService.setPassword(this.email, this.setPasswordForm.value.newPassword).subscribe(response => {
        console.log(response);
        this.setPasswordForm.reset();
        this.toastr.success('Your password changed successfully, GO to login form.');
      }, error => {
        console.log(error);
        this.toastr.error("Something went wrong please try again.")
      })
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
}
