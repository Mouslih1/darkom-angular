import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Immeuble } from 'src/app/model/immeuble/immeuble';
import { ImmeubleService } from 'src/app/service/immeuble/immeuble.service';

@Component({
  selector: 'app-immeuble',
  templateUrl: './immeuble.component.html',
  styleUrls: ['./immeuble.component.css']
})
export class ImmeubleComponent implements OnInit {

  immeubleRequest!: FormGroup;
  immeubleList: Immeuble[] = [];
  pageNo = 0;
  pageSize = 10;
  totalPages = 0;


  constructor(
    private formBuilder: FormBuilder,
    private immeubleService: ImmeubleService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.all();
  }

  initForm() {
    this.immeubleRequest = this.formBuilder.group({
      id: [''],
      referenceImmeuble: ['', [Validators.required]],
      address: ['', [Validators.required]],
      numberEtage: ['', [Validators.required]],
      numberApparetement: ['', [Validators.required]],
      anneeConstruction: ['', [Validators.required]]
    });
  }

  all() {
    this.immeubleService.all(this.pageNo, this.pageSize).subscribe(
      (res: Immeuble[]) => {
        this.immeubleList = res;
        this.totalPages = Math.ceil(res.length / this.pageSize);

        console.log('immeubles fetched successfully:', res);
      },
      (error: any) => {
        console.error('Error while fetching immeubles:', error);
      }
    );
  }

  onSaveImmeuble()
  {
    this.markFormGroupTouched(this.immeubleRequest);


    if (this.immeubleRequest.valid) {
      this.immeubleService.saveImmeuble(this.immeubleRequest.value).subscribe(
        (response) => {
          this.all();
          this.immeubleRequest.reset();
          this.toastr.success('Immeuble saved successfully.');
        },
        (error) => {
            console.log('error ', error);
            if (error && error.error && error.error.includes("Violation de contrainte unique : cette reference immeuble existe déjà.")) {
              this.toastr.error('This reference immeuble already exists.');
            } else {
              this.toastr.error('Something went wrong, please try again.');
            }
          }
      );
    }
  }

  onUpdateImmeuble()
  {
    this.markFormGroupTouched(this.immeubleRequest);

    if (this.immeubleRequest.valid) {
      this.immeubleService.updateImmeuble(
        this.immeubleRequest.value.id,
        this.immeubleRequest.value
      ).subscribe(
        (response) => {
          this.all();
          this.toastr.success('Immeuble updated successfully.');
        },
        (error) => {
          console.log('error ', error);
          if (error && error.error && error.error.includes("Violation de contrainte unique : cette reference immeuble existe déjà.")) {
            this.toastr.error('This reference immeuble already exists.');
          } else {
            this.toastr.error('Something went wrong, please try again.');
          }
        }
      );
    }
  }

  onDeleteImmeuble() {
    console.log('this.agenceRequest.value : ', this.immeubleRequest.value);
    this.immeubleService.deleteImmeuble(
      this.immeubleRequest.value.id
    ).subscribe((response) => {
      console.log('Immeuble deleted successfully:', response);
      this.all();
      this.toastr.success("Immeuble deleted successfully.");

    },
      (error) => {
        console.error('Error while delete immeuble:', error);
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

    if (this.pageNo < this.totalPages) {
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

  editImmeuble(immeuble: Immeuble) {
    this.immeubleRequest.patchValue({
      id: immeuble.id,
      referenceImmeuble: immeuble.referenceImmeuble,
      address: immeuble.address,
      numberEtage: immeuble.numberEtage,
      numberApparetement: immeuble.numberApparetement,
      anneeConstruction: immeuble.anneeConstruction
    });

    console.log('anne construction : ', this.immeubleRequest.value);

  }

  deleteImmeuble(immeuble: Immeuble) {
    this.immeubleRequest.patchValue({
      id: immeuble.id
    });
  }
}
