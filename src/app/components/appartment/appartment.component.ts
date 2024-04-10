import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Appartment } from 'src/app/model/appartment/appartment';
import { Immeuble } from 'src/app/model/immeuble/immeuble';
import { AppartmentService } from 'src/app/service/appartment/appartment.service';
import { ImmeubleService } from 'src/app/service/immeuble/immeuble.service';

@Component({
  selector: 'app-appartment',
  templateUrl: './appartment.component.html',
  styleUrls: ['./appartment.component.css']
})
export class AppartmentComponent implements OnInit {

  appartmentRequest!: FormGroup;
  appartmentList: any[] = [];
  immeubles: any[] = [];

  pageNo = 0;
  pageSize = 10;
  totalPages = 0;


  constructor(
    private formBuilder: FormBuilder,
    private appartmentService: AppartmentService,
    private toastr: ToastrService,
    private immeubleService: ImmeubleService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void
  {
    this.initForm();
    this.all();
    this.allImmeubles();
  }

  initForm() {
    this.appartmentRequest = this.formBuilder.group({
      id: [''],
      referenceAppartement: ['', [Validators.required]],
      numberChambre: ['', [Validators.required]],
      surface: ['', [Validators.required]],
      prixLocation: ['', [Validators.required]],
      prixVente: ['', [Validators.required]],
      statusAppartement: ['', [Validators.required]],
      etatAppartement: ['', [Validators.required]],
      immeubleId: ['', [Validators.required]]
    });
  }

  all() {
    this.appartmentService.all(this.pageNo, this.pageSize).subscribe(
      (res: Appartment[]) => {
        let tempList: any[] = [];

        res.forEach(appartement => {
          this.immeubleService.getById(appartement.immeubleId).subscribe((response: Immeuble) => {
            console.log('immeuble info : ', response);
            appartement.immeuble = response
            console.log("appartment : ", appartement);
            tempList.push(appartement);
            console.log('non non non :::', tempList);
          });
        });

        this.appartmentList = tempList;
        console.log('appartment list : with immeuble', this.appartmentList);

        this.totalPages = Math.ceil(res.length / this.pageSize);
        console.log('Users fetched successfully:', res);
      },
      (error: any) => {
        console.error('Error while fetching users:', error);
      }
    );
  }

  allImmeubles()
  {
    this.immeubleService.all(0, 100000).subscribe((response) => {
      this.immeubles = response;
      console.log('immeubles hahahah :',this.immeubles);
    });
  }

  onSaveAppartment() {
    this.markFormGroupTouched(this.appartmentRequest);

    if (this.appartmentRequest.valid) {
      this.appartmentService.saveAppartement(this.appartmentRequest.value).subscribe(
        (response) => {
          this.all();
          this.appartmentRequest.reset();
          this.toastr.success('Appartement saved successfully.');
        },
        (error) => {
          console.log('error ', error);
          this.toastr.error('Something went wrong, please try again.');
        }
      );
    }
  }

  onUpdateAppartement() {
    this.markFormGroupTouched(this.appartmentRequest);

    if (this.appartmentRequest.valid) {
      this.appartmentService.updateAppartement(
        this.appartmentRequest.value.id,
        this.appartmentRequest.value
      ).subscribe(
        (response) => {
          this.all();
          this.toastr.success('Appartement updated successfully.');
        },
        (error) => {
          console.log('error ', error);

          this.toastr.error('Something went wrong, please try again.');
        }
      );
    }
  }

  onDeleteAppartement() {
    console.log('this.agenceRequest.value : ', this.appartmentRequest.value);
    this.appartmentService.deleteAppartement(
      this.appartmentRequest.value.id
    ).subscribe((response) => {
      console.log('Appartement deleted successfully:', response);
      this.all();
      this.toastr.success("Appartement deleted successfully.");

    },
      (error) => {
        console.error('Error while delete appartement:', error);
        this.toastr.error("Something went wrong please try again.")
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

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  editAppartment(appartement: Appartment) {
    this.appartmentRequest.patchValue({
      id: appartement.id,
      referenceAppartement: appartement.referenceAppartement,
      numberChambre: appartement.numberChambre,
      surface: appartement.surface,
      prixLocation: appartement.prixLocation,
      prixVente: appartement.prixVente,
      statusAppartement: appartement.statusAppartement,
      etatAppartement: appartement.etatAppartement,
      immeubleId: appartement.etatAppartement
    });

    console.log('anne construction : ', this.appartmentRequest.value);
  }

  deleteAppartement(appartement: Appartment) {
    this.appartmentRequest.patchValue({
      id: appartement.id
    });
  }
}
