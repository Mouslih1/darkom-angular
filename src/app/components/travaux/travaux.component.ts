import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { LoggerUser } from 'src/app/model/authentification/logged-user';
import { Travaux } from 'src/app/model/travaux/travaux';
import { AuthentificationService } from 'src/app/service/authentification/authentification.service';
import { ImmeubleService } from 'src/app/service/immeuble/immeuble.service';
import { TravauxService } from 'src/app/service/travaux/travaux.service';

@Component({
  selector: 'app-travaux',
  templateUrl: './travaux.component.html',
  styleUrls: ['./travaux.component.css']
})
export class TravauxComponent implements OnInit {

  travauxRequest!: FormGroup;
  travauxList: Travaux[] = [];
  immeubles: any[] = [];

  pageNo = 0;
  pageSize = 10;
  totalPages = 0;
  searchText: any;



  userSub!:  Subscription;
  isSyndec = false;
  roles!: string[];


  constructor(
    private formBuilder: FormBuilder,
    private immeubleService: ImmeubleService,
    private travauxService: TravauxService,
    private toastr: ToastrService,
    private authService: AuthentificationService
  ) { }

  ngOnInit(): void
  {
    this.initForm();
    this.all();
    this.allImmeubles();
    this.userPermision();
  }

  initForm()
  {
    this.travauxRequest = this.formBuilder.group({
      id: [''],
      sujet: ['', [Validators.required]],
      description: ['', [Validators.required]],
      etat: ['', [Validators.required]],
      dateDebut: ['', [Validators.required]],
      dateFin: ['', [Validators.required]],
      montant: ['', [Validators.required]],
      immeubleId: ['', [Validators.required]]
    });
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

    if(loggedUser?.roles.includes("SYNDEC")) this.isSyndec = true;
  }

  all()
  {
    this.travauxService.all(this.pageNo, this.pageSize).subscribe(
      (res: Travaux[]) => {
        let tempList: any[] = [];

        res.forEach(travaux => {

          this.immeubleService.getById(travaux.immeubleId).subscribe((response) => {
            console.log('travaux info get By Id : ', response);
            travaux.immeuble = response
            console.log("travaux  : ", travaux);
          });

          tempList.push(travaux);
        });

        this.travauxList = tempList;
        console.log('Travaux avec appartement', this.travauxList);

        this.totalPages = Math.ceil(res.length / this.pageSize);
        console.log('Travaux fetched successfully:', res);
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

  onSaveTravaux()
  {
    this.markFormGroupTouched(this.travauxRequest);

    console.log('this.travaux.value : ',this.travauxRequest.value);
    if (this.travauxRequest.valid)
    {
      this.travauxService.saveTravaux(this.travauxRequest.value).subscribe(
        (response) => {
          console.log('Travaux saved successfully.',response);

          this.all();
          this.travauxRequest.reset();
          this.toastr.success('Travaux saved successfully.');
        },
        (error) => {
          console.log('error ', error);
          this.toastr.error('Something went wrong, please try again.');
        }
      );
    }
  }

  onUpdateTravaux()
  {
    this.markFormGroupTouched(this.travauxRequest);

    console.log('Travaux edit : ', this.travauxRequest.value);


    if (this.travauxRequest.valid)
    {
      this.travauxService.updateTravaux(
        this.travauxRequest.value.id,
        this.travauxRequest.value
      ).subscribe(
        (response) => {
          this.all();
          this.toastr.success('Travaux updated successfully.');
        },
        (error) => {
          console.log('error ', error);
          this.toastr.error('Something went wrong, please try again.');
        }
      );
    }
  }

  onDeleteTravaux()
  {
    console.log('this.travaux.value : ', this.travauxRequest.value);
    this.travauxService.deleteTravaux(
      this.travauxRequest.value.id
    ).subscribe((response) => {
      console.log('Travaux deleted successfully:', response);
      this.all();
      this.toastr.success("Travaux deleted successfully.");
    },
      (error) => {
        console.error('Error while delete Travaux:', error);
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

  editTravaux(travaux: Travaux)
  {
    //const plainte = this.appartements.find(appartement => appartement.id === event.appartementId);

    //console.log("immeuble", appartement);

    this.travauxRequest.setValue({
      id: travaux.id,
      sujet: travaux.sujet,
      description: travaux.description,
      etat: travaux.etat,
      dateDebut: travaux.dateDebut,
      dateFin: travaux.dateFin,
      montant: travaux.montant,
      immeubleId: travaux.immeubleId
    });

    console.log('Plainte modifié : ', this.travauxRequest.value);
  }

  deleteTravaux(travaux: Travaux)
  {
    this.travauxRequest.patchValue({
      id: travaux.id
    });
  }
}
