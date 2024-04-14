import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PaymentContratLoyer } from 'src/app/model/payment/payment-contrat-loyer';
import { ContratService } from 'src/app/service/contrat/contrat.service';
import { PaymentContratLoyerService } from 'src/app/service/payment/payment-contrat-loyer.service';

@Component({
  selector: 'app-payment-contrat-loyer',
  templateUrl: './payment-contrat-loyer.component.html',
  styleUrls: ['./payment-contrat-loyer.component.css']
})
export class PaymentContratLoyerComponent implements OnInit {

  paymentLoyerRequest!: FormGroup;
  paymentLoyerList: PaymentContratLoyer[] = [];
  contrats: any[] = [];

  pageNo = 0;
  pageSize = 10;
  totalPages = 0;
  searchText: any;


  constructor(
    private formBuilder: FormBuilder,
    private contratService: ContratService,
    private paymentContratLoyerService: PaymentContratLoyerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void
  {
    this.initForm();
    this.all();
    this.allContrats();
  }

  initForm()
  {
    this.paymentLoyerRequest = this.formBuilder.group({
      id: [''],
      statusPaymentContrat: ['', [Validators.required]],
      contratId: ['', [Validators.required]],
      montantPaye: ['', [Validators.required]],
      typePaymentContratLoyer: ['', [Validators.required]],
      methodePaymentContratLoyer: ['', [Validators.required]]
    });
  }

  all()
  {
    this.paymentContratLoyerService.all(this.pageNo, this.pageSize).subscribe(
      (res: PaymentContratLoyer[]) => {
        let tempList: any[] = [];

        res.forEach(paymentLoyer => {

          this.contratService.getById(paymentLoyer.contratId).subscribe((response) => {
            console.log('contrat info get By Id : ', response);
            paymentLoyer.contrat = response
            console.log("Payment loyer  : ", paymentLoyer);
          });

          tempList.push(paymentLoyer);
        });

        this.paymentLoyerList = tempList;
        console.log('Payment list loyer avec appartement', this.paymentLoyerList);

        this.totalPages = Math.ceil(res.length / this.pageSize);
        console.log('Plaintes fetched successfully:', res);
      },
      (error: any) => {
        console.error('Error while fetching users:', error);
      }
    );
  }

  allContrats()
  {
    this.contratService.all(0, 100000).subscribe((response) => {
      this.contrats = response.filter(contrat =>
        contrat.typeContrat.includes("CONTRAT_LOUER")
    );
      console.log('Contrats :',this.contrats);
    });
  }

  onSavePaymentLoyer()
  {
    this.markFormGroupTouched(this.paymentLoyerRequest);

    console.log('this.paymentLoyerRequest.value : ',this.paymentLoyerRequest.value);
    if (this.paymentLoyerRequest.valid)
    {
      this.paymentContratLoyerService.savePaymentLoyer(this.paymentLoyerRequest.value).subscribe(
        (response) => {
          console.log('Payment loyer saved successfully.',response);

          this.all();
          this.paymentLoyerRequest.reset();
          this.toastr.success('Payment contrat loyer saved successfully.');
        },
        (error) => {
          console.log('error ', error);
          this.toastr.error('Something went wrong, please try again.');
        }
      );
    }
  }

  onUpdatePaymentLoyer()
  {
    this.markFormGroupTouched(this.paymentLoyerRequest);

    console.log('Payment loyer edit : ', this.paymentLoyerRequest.value);


    if (this.paymentLoyerRequest.valid)
    {
      this.paymentContratLoyerService.updatePaymentLoyer(
        this.paymentLoyerRequest.value.id,
        this.paymentLoyerRequest.value
      ).subscribe(
        (response) => {
          this.all();
          this.toastr.success('Payment contrat loyer updated successfully.');
        },
        (error) => {
          console.log('error ', error);
          this.toastr.error('Something went wrong, please try again.');
        }
      );
    }
  }

  onDeletePaymentLoyer()
  {
    console.log('this.paymentloyer.value : ', this.paymentLoyerRequest.value);
    this.paymentContratLoyerService.deletePaymentLoyer(
      this.paymentLoyerRequest.value.id
    ).subscribe((response) => {
      console.log('Payment contrat loyer deleted successfully:', response);
      this.all();
      this.toastr.success("Payment contrat loyer deleted successfully.");

    },
      (error) => {
        console.error('Error while delete payment loyer:', error);
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


  filterByStatus(status: string)
  {
    this.searchText = status;
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

  markFormGroupTouched(formGroup: FormGroup)
  {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  editPaymentLoyer(paymentLoyer: PaymentContratLoyer)
  {
    //const plainte = this.appartements.find(appartement => appartement.id === event.appartementId);

    //console.log("immeuble", appartement);

    this.paymentLoyerRequest.setValue({
      id: paymentLoyer.id,
      statusPaymentContrat: paymentLoyer.statusPaymentContrat,
      contratId: paymentLoyer.contratId,
      montantPaye: paymentLoyer.montantPaye,
      typePaymentContratLoyer: paymentLoyer.typePaymentContratLoyer,
      methodePaymentContratLoyer: paymentLoyer.methodePaymentContratLoyer
    });

    console.log('Payment contrat loyer modifié : ', this.paymentLoyerRequest.value);
  }

  deletePaymentLoyer(paymentLoyer: PaymentContratLoyer)
  {
    this.paymentLoyerRequest.patchValue({
      id: paymentLoyer.id
    });
  }
}
