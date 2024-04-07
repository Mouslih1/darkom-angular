import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthentificationService } from 'src/app/service/authentification/authentification.service';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.css']
})
export class AuthentificationComponent implements OnInit {

  loginFormGroup!: FormGroup;

  constructor(
    private fb : FormBuilder,
    private authService: AuthentificationService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void
  {
    this.loginFormGroup = this.fb.group({
      username: ["", [Validators.required]],
      password: ["", Validators.required /*, Validators.minLength(8)*/],
    })
  }

  onLogin()
  {
    console.log("login on");

    this.markFormGroupTouched(this.loginFormGroup);

    if(this.loginFormGroup.valid)
    {
      console.log('login valid');

      this.authService.login(this.loginFormGroup.value).subscribe({
        next: loginResponse => {
          this.authService.saveToken(loginResponse);
          console.log(loginResponse);
        },

        error: err => {
          console.log(err);
          this.toastr.error("Incorrect username & password.");
        }
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
