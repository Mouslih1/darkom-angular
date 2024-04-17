import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { LoggerUser } from 'src/app/model/authentification/logged-user';
import { PaymentSyndec } from 'src/app/model/payment/payment-syndec';
import { AuthentificationService } from 'src/app/service/authentification/authentification.service';
import { PaymentSyndecService } from 'src/app/service/payment/payment-syndec.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-payment-syndec',
  templateUrl: './payment-syndec.component.html',
  styleUrls: ['./payment-syndec.component.css']
})
export class PaymentSyndecComponent implements OnInit {


  paymentSyndecRequest!: FormGroup;
  paymentSyndecList: PaymentSyndec[] = [];
  proprietaires: any[] = [];

  pageNo = 0;
  pageSize = 10;
  totalPages = 0;
  searchText: any;

  userSub!:  Subscription;
  isAgent = false;
  roles!: string[];


  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private paymentSyndecService: PaymentSyndecService,
    private toastr: ToastrService,
    private authService: AuthentificationService
  ) { }

  ngOnInit(): void
  {
    this.initForm();
    this.all();
    this.allPropreitaires();
    this.userPermision();
  }

  initForm()
  {
    this.paymentSyndecRequest = this.formBuilder.group({
      id: [''],
      description: ['', [Validators.required]],
      montantPaye: ['', [Validators.required]],
      typePaymentSyndecal: ['', [Validators.required]],
      methodePaymentSyndecal: ['', [Validators.required]],
      statusPaymentSyndecal: ['', [Validators.required]],
      payerId: ['', [Validators.required]]
    });
  }

  all()
  {
    this.paymentSyndecService.all(this.pageNo, this.pageSize).subscribe(
      (res: PaymentSyndec[]) => {
        let tempList: any[] = [];

        res.forEach(paymentSyndec => {

          this.userService.getUserbyId(paymentSyndec.payerId).subscribe((response) => {
            console.log('user info get By Id : ', response);

              paymentSyndec.propreitaire = response;
              tempList.push(paymentSyndec);
              console.log("Payment syndec  : ", paymentSyndec);
          });
        });

        this.paymentSyndecList = tempList;
        console.log('Payment syndec avec appartement', this.paymentSyndecList);

        this.totalPages = Math.ceil(tempList.length / this.pageSize);
        console.log('Payment syndec fetched successfully:', res);
      },
      (error: any) => {
        console.error('Error while fetching users:', error);
      }
    );
  }

  allPropreitaires()
  {
    this.userService.allByAgence(0, 100000).subscribe((response) => {
        this.proprietaires = response.filter(user =>
            user.userDto.role.includes("PROPRIETAIRE") || user.userDto.role.includes("SYNDEC")
        );
        console.log('Propriétaires avec le rôle PROPREITAIRE et SYNDEC :', this.proprietaires);
    });
  }

  onSavePaymentSyndec()
  {
    this.markFormGroupTouched(this.paymentSyndecRequest);

    console.log('this.paymentSyndecRequest.value : ',this.paymentSyndecRequest);
    if (this.paymentSyndecRequest.valid)
    {
      this.paymentSyndecService.savePaymentSyndec(this.paymentSyndecRequest.value).subscribe(
        (response) => {
          console.log('Payment syndec saved successfully.',response);

          this.toastr.success('Payment syndec saved successfully.');
          this.all();
          this.paymentSyndecRequest.reset();
        },
        (error) => {
          console.log('error ', error);
          this.toastr.error('Something went wrong, please try again.');
        }
      );
    }
  }

  onUpdatePaymentSyndec()
  {
    this.markFormGroupTouched(this.paymentSyndecRequest);

    console.log('Payment syndec edit : ', this.paymentSyndecRequest.value);


    if (this.paymentSyndecRequest.valid)
    {
      this.paymentSyndecService.updatePaymentSyndec(
        this.paymentSyndecRequest.value.id,
        this.paymentSyndecRequest.value
      ).subscribe(
        (response) => {
          this.all();
          this.toastr.success('Payment syndec updated successfully.');
        },
        (error) => {
          console.log('error ', error);
          this.toastr.error('Something went wrong, please try again.');
        }
      );
    }
  }

  onDeletePaymentSyndec()
  {
    console.log('this.paymentSyndec.value : ', this.paymentSyndecRequest.value);
    this.paymentSyndecService.deletePaymentSyndec(
      this.paymentSyndecRequest.value.id
    ).subscribe((response) => {
      console.log('Payment syndec deleted successfully:', response);
      this.all();
      this.toastr.success("Payment syndec deleted successfully.");

    },
      (error) => {
        console.error('Error while delete payment vente:', error);
        this.toastr.error("Something went wrong please try again.")
      });
  }

  previousPage()
  {
    if (this.pageNo > 0) {
      this.pageNo--;
      this.all();
    }
  }


  userPermision()
  {
    this.userSub = this.authService.user.subscribe(loggerUser => {

      this.setRole(loggerUser);
      if(loggerUser)
      {
        this.roles = loggerUser.roles;
      }
      console.log('role user permission :', this.roles);
    });
  }

  setRole(loggedUser:LoggerUser | null)
  {
    console.log('role role :', loggedUser?.roles);

    if(loggedUser?.roles.includes("AGENT")) this.isAgent = true;
  }


  nextPage()
  {
    console.log(this.totalPages);
    console.log(this.pageNo);

    if (this.pageNo  <= this.totalPages) {
      this.pageNo++;
      this.all();
    }
  }

  filterByStatus(status: string)
  {
    this.searchText = status;
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

  editPaymentSyndec(paymentSyndec: PaymentSyndec)
  {
    this.paymentSyndecRequest.setValue({
      id: paymentSyndec.id,
      description:  paymentSyndec.description,
      montantPaye: paymentSyndec.montantPaye,
      typePaymentSyndecal: paymentSyndec.typePaymentSyndecal,
      methodePaymentSyndecal: paymentSyndec.methodePaymentSyndecal,
      statusPaymentSyndecal: paymentSyndec.statusPaymentSyndecal,
      payerId: paymentSyndec.payerId
    });

    console.log('Payment syndec modifié : ', this.paymentSyndecRequest.value);
  }

  deletePaymentSyndec(paymentSyndec: PaymentSyndec)
  {
    this.paymentSyndecRequest.patchValue({
      id: paymentSyndec.id
    });
  }
}
