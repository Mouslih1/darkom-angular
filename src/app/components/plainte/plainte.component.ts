import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Immeuble } from 'src/app/model/immeuble/immeuble';
import { Plainte } from 'src/app/model/plainte/plainte';
import { ImmeubleService } from 'src/app/service/immeuble/immeuble.service';
import { PlainteService } from 'src/app/service/plainte/plainte.service';

@Component({
  selector: 'app-plainte',
  templateUrl: './plainte.component.html',
  styleUrls: ['./plainte.component.css']
})
export class PlainteComponent implements OnInit {

  plainteRequest!: FormGroup;
  plainteList: Plainte[] = [];
  immeubles: any[] = [];

  pageNo = 0;
  pageSize = 10;
  totalPages = 0;


  constructor(
    private formBuilder: FormBuilder,
    private immeubleService: ImmeubleService,
    private plainteService: PlainteService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void
  {
    this.initForm();
    this.all();
    this.allImmeubles();
  }

  initForm()
  {
    this.plainteRequest = this.formBuilder.group({
      id: [''],
      sujet: ['', [Validators.required]],
      description: ['', [Validators.required]],
      statusPlainte: ['', [Validators.required]],
      urgence: ['', [Validators.required]],
      immeubleId: ['', [Validators.required]]
    });
  }

  all()
  {
    this.plainteService.all(this.pageNo, this.pageSize).subscribe(
      (res: Plainte[]) => {
        let tempList: any[] = [];

        res.forEach(plainte => {

          this.immeubleService.getById(plainte.immeubleId).subscribe((response) => {
            console.log('immeuble info get By Id : ', response);
            plainte.immeuble = response
            console.log("plainte  : ", plainte);
          });

          tempList.push(plainte);
        });

        this.plainteList = tempList;
        console.log('Plainte avec appartement', this.plainteList);

        this.totalPages = Math.ceil(res.length / this.pageSize);
        console.log('Plaintes fetched successfully:', res);
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
      console.log('Immeubles :',this.immeubles);
    });
  }

  onSavePlainte()
  {
    this.markFormGroupTouched(this.plainteRequest);

    console.log('this.plainteRequest.value : ',this.plainteRequest.value);
    if (this.plainteRequest.valid)
    {
      this.plainteService.savePlainte(this.plainteRequest.value).subscribe(
        (response) => {
          console.log('Plainte saved successfully.',response);

          this.all();
          this.plainteRequest.reset();
          this.toastr.success('Plainte saved successfully.');
        },
        (error) => {
          console.log('error ', error);
          this.toastr.error('Something went wrong, please try again.');
        }
      );
    }
  }

  onUpdatePlainte()
  {
    this.markFormGroupTouched(this.plainteRequest);

    console.log('Plainte edit : ', this.plainteRequest.value);


    if (this.plainteRequest.valid)
    {
      this.plainteService.updatePlainte(
        this.plainteRequest.value.id,
        this.plainteRequest.value
      ).subscribe(
        (response) => {
          this.all();
          this.toastr.success('Plainte updated successfully.');
        },
        (error) => {
          console.log('error ', error);
          this.toastr.error('Something went wrong, please try again.');
        }
      );
    }
  }

  onDeletePlainte()
  {
    console.log('this.agenceRequest.value : ', this.plainteRequest.value);
    this.plainteService.deletePlainte(
      this.plainteRequest.value.id
    ).subscribe((response) => {
      console.log('Plainte deleted successfully:', response);
      this.all();
      this.toastr.success("Plainte deleted successfully.");

    },
      (error) => {
        console.error('Error while delete Evenement:', error);
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

    if (this.pageNo + 1 < this.totalPages) {
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

  editPlainte(plainte: Plainte)
  {
    //const plainte = this.appartements.find(appartement => appartement.id === event.appartementId);

    //console.log("immeuble", appartement);

    this.plainteRequest.setValue({
      id: plainte.id,
      sujet: plainte.sujet,
      description: plainte.description,
      statusPlainte: plainte.statusPlainte,
      urgence: plainte.urgence,
      immeubleId: plainte.immeubleId
    });

    console.log('Plainte modifié : ', this.plainteRequest.value);
  }

  deletePlainte(plainte: Plainte)
  {
    this.plainteRequest.patchValue({
      id: plainte.id
    });
  }
}
