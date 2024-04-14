import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Appartment } from 'src/app/model/appartment/appartment';
import { Contrat } from 'src/app/model/contrat/contrat';
import { Role } from 'src/app/model/user/role';
import { AppartmentService } from 'src/app/service/appartment/appartment.service';
import { ContratService } from 'src/app/service/contrat/contrat.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-contrat',
  templateUrl: './contrat.component.html',
  styleUrls: ['./contrat.component.css']
})
export class ContratComponent implements OnInit {

  contratRequest!: FormGroup;
  contratList: Contrat[] = [];
  appartements: any[] = [];
  propreitaires: any[] = [];

  pageNo = 0;
  pageSize = 10;
  totalPages = 0;
searchText: any;


  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private appartmentService: AppartmentService,
    private contratService: ContratService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void
  {
    this.initForm();
    this.all();
    this.allAppartements();
    this.allPropreitaires();
  }

  filterByStatus(status: string)
  {
    this.searchText = status;
  }

  initForm()
  {
    this.contratRequest = this.formBuilder.group({
      id: [''],
      dateSignature: ['', [Validators.required]],
      appartementId: ['', [Validators.required]],
      propreitaireId: ['', [Validators.required]]
    });
  }

  all()
  {
    this.contratService.all(this.pageNo, this.pageSize).subscribe(
      (res: Contrat[]) => {
        let tempList: any[] = [];

        res.forEach(contrat => {
          this.appartmentService.getById(contrat.appartementId).subscribe((response) => {
            console.log('appartement info : ', response);
            contrat.appartement = response;
            console.log("contrat : ", contrat);
          });

          this.userService.getUserbyId(contrat.propreitaireId).subscribe((response) => {
            console.log('users : ', response);
              contrat.propreitaire = response;

          });
          tempList.push(contrat);
        });

        this.contratList = tempList;
        console.log('contrat list : with appartment, propreitaire', this.contratList);

        this.totalPages = Math.ceil(this.contratList.length / this.pageSize);
        console.log('Users fetched successfully:', this.contratList);
      },
      (error: any) => {
        console.error('Error while fetching users:', error);
      }
    );
  }

  allAppartements()
  {
    this.appartmentService.all(0, 100000).subscribe((response) => {
      this.appartements = response;
      console.log('appartments hahahah :',this.appartements);
    });
  }

  allPropreitaires()
  {
    this.userService.all(0, 100000).subscribe((response) => {
        this.propreitaires = response.filter(user =>
            user.userDto.role.includes("PROPRIETAIRE") || user.userDto.role.includes("SYNDEC")
        );
        console.log('Propriétaires avec le rôle PROPREITAIRE et SYNDEC :', this.propreitaires);
    });
  }

  onSaveContrat()
  {
    this.markFormGroupTouched(this.contratRequest);

    console.log('contrat : ', this.contratRequest);
  if (this.contratRequest.valid)
  {
      this.contratService.saveContrat(this.contratRequest.value).subscribe(
        (response) => {
          console.log('Contrat saved successfully.',response);

          this.all();
          this.contratRequest.reset();
          this.toastr.success('Contract saved successfully.');
        },
        (error) => {
          console.log('error ', error);
          if (error && error.error && error.error.message.includes("We has this appartement in other contrat.")) {
            this.toastr.error('We has this appartement in other contrat.');
          } else {
            this.toastr.error('Something went wrong, please try again.');
          }

        }
      );
    }
  }

  onUpdateContrat()
  {
    this.markFormGroupTouched(this.contratRequest);

    if (this.contratRequest.valid)
    {
      this.contratService.updateContrat(
        this.contratRequest.value.id,
        this.contratRequest.value
      ).subscribe(
        (response) => {
          this.all();
          this.toastr.success('Contrat updated successfully.');
        },
        (error) => {
          console.log('error ', error);
          if (error && error.error && error.error.message.includes("We has this appartement in other contrat.")) {
            this.toastr.error('We has this appartement in other contrat.');
          } else {
            this.toastr.error('Something went wrong, please try again.');
          }
        }
      );
    }
  }

  onDeleteContrat()
  {
    console.log('this.contratRequest.value : ', this.contratRequest.value);
    this.contratService.deleteContrat(
      this.contratRequest.value.id
    ).subscribe((response) => {
      console.log('Contrat deleted successfully:', response);
      this.all();
      this.toastr.success("Contrat deleted successfully.");

    },
      (error) => {
        console.error('Error while delete appartement:', error);
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

  editContrat(contrat: Contrat)
  {
   //const immeuble = this.immeubles.find(immeuble => immeuble.id === appartement.immeubleId);

   // console.log("immeuble", immeuble);

    this.contratRequest.setValue({
      id: contrat.id,
      dateSignature: contrat.dateSignature,
      appartementId: contrat.appartementId,
      propreitaireId: contrat.propreitaireId
    });

    console.log('Contrat modifié : ', this.contratRequest.value);
  }

  deleteContrat(contrat: Contrat)
  {
    this.contratRequest.patchValue({
      id: contrat.id
    });
  }
}
