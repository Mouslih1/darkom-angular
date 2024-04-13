import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  ForgotPasswordForm !:  FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void
  {
    this.ForgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.ForgotPasswordForm.get('email');
  }

  forgotPassword()
  {
    this.markFormGroupTouched(this.ForgotPasswordForm);

    console.log('email :', this.ForgotPasswordForm.value.email);

    if (this.ForgotPasswordForm.valid)
    {
      const email = this.ForgotPasswordForm.value.email;
      this.userService.forgotPassword(email).subscribe(
        response   => {
          console.log(response);
          this.toastr.success('Check you email for set password');
          this.ForgotPasswordForm.reset();
        },
        error => {
          console.error(error);
          this.toastr.error('Something went wrong, please try again.');
        }
      );
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
