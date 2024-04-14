import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PaymentContratVente } from 'src/app/model/payment/payment-contrat-vente';
import { ContratService } from 'src/app/service/contrat/contrat.service';
import { PaymentContratVenteService } from 'src/app/service/payment/payment-contrat-vente.service';

@Component({
  selector: 'app-payment-contrat-vente',
  templateUrl: './payment-contrat-vente.component.html',
  styleUrls: ['./payment-contrat-vente.component.css']
})
export class PaymentContratVenteComponent implements OnInit {


  paymentVenteRequest!: FormGroup;
  paymentVenteList: PaymentContratVente[] = [];
  contrats: any[] = [];

  pageNo = 0;
  pageSize = 10;
  totalPages = 0;
searchText: any;


  constructor(
    private formBuilder: FormBuilder,
    private contratService: ContratService,
    private paymentContratVenteService: PaymentContratVenteService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void
  {
    this.initForm();
    this.all();
    this.allContrats();
  }

  filterByStatus(status: string)
  {
    this.searchText = status;
  }

  initForm()
  {
    this.paymentVenteRequest = this.formBuilder.group({
      id: [''],
      statusPaymentContrat: ['', [Validators.required]],
      contratId: ['', [Validators.required]],
      montantPaye: ['', [Validators.required]],
      methodePaymentContratVente: ['', [Validators.required]],
      typePaymentContratVente: ['', [Validators.required]],
    });
  }

  all()
  {
    this.paymentContratVenteService.all(this.pageNo, this.pageSize).subscribe(
      (res: PaymentContratVente[]) => {
        let tempList: any[] = [];

        res.forEach(paymentVente => {

          this.contratService.getById(paymentVente.contratId).subscribe((response) => {
            console.log('contrat info get By Id : ', response);
            paymentVente.contrat = response
            console.log("Payment vente  : ", paymentVente);
          });

          tempList.push(paymentVente);
        });

        this.paymentVenteList = tempList;
        console.log('Payment list vente avec appartement', this.paymentVenteList);

        this.totalPages = Math.ceil(res.length / this.pageSize);
        console.log('Payment vente fetched successfully:', res);
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
        contrat.typeContrat.includes("CONTRAT_VENTE")
    );
      console.log('Contrats :',this.contrats);
    });
  }

  onSavePaymentVente()
  {
    this.markFormGroupTouched(this.paymentVenteRequest);

    console.log('this.paymentVenteRequest.value : ',this.paymentVenteRequest);
    if (this.paymentVenteRequest.valid)
    {
      this.paymentContratVenteService.savePaymentVente(this.paymentVenteRequest.value).subscribe(
        (response) => {
          console.log('Payment vente saved successfully.',response);

          this.all();
          this.paymentVenteRequest.reset();
          this.toastr.success('Payment contrat vente saved successfully.');
        },
        (error) => {
          console.log('error ', error);
          this.toastr.error('Something went wrong, please try again.');
        }
      );
    }
  }

  onUpdatePaymentVente()
  {
    this.markFormGroupTouched(this.paymentVenteRequest);

    console.log('Payment loyer edit : ', this.paymentVenteRequest.value);


    if (this.paymentVenteRequest.valid)
    {
      this.paymentContratVenteService.updatePaymentVente(
        this.paymentVenteRequest.value.id,
        this.paymentVenteRequest.value
      ).subscribe(
        (response) => {
          this.all();
          this.toastr.success('Payment contrat vente updated successfully.');
        },
        (error) => {
          console.log('error ', error);
          this.toastr.error('Something went wrong, please try again.');
        }
      );
    }
  }

  onDeletePaymentVente()
  {
    console.log('this.paymentVente.value : ', this.paymentVenteRequest.value);
    this.paymentContratVenteService.deletePaymentVente(
      this.paymentVenteRequest.value.id
    ).subscribe((response) => {
      console.log('Payment contrat vente deleted successfully:', response);
      this.all();
      this.toastr.success("Payment contrat vente deleted successfully.");

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

  nextPage()
  {
    console.log(this.totalPages);
    console.log(this.pageNo);

    if (this.pageNo <= this.totalPages) {
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

  editPaymentVente(paymentVente: PaymentContratVente)
  {
    //const plainte = this.appartements.find(appartement => appartement.id === event.appartementId);

    //console.log("immeuble", appartement);

    this.paymentVenteRequest.setValue({
      id: paymentVente.id,
      statusPaymentContrat: paymentVente.statusPaymentContrat,
      contratId: paymentVente.contratId,
      montantPaye: paymentVente.montantPaye,
      methodePaymentContratVente: paymentVente.methodePaymentContratVente,
      typePaymentContratVente: paymentVente.typePaymentContratVente,
      montantRester: paymentVente.montantRester
    });

    console.log('Payment contrat vente modifié : ', this.paymentVenteRequest.value);
  }

  deletePaymentVente(paymentVente: PaymentContratVente)
  {
    this.paymentVenteRequest.patchValue({
      id: paymentVente.id
    });
  }
}
