import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Appartment } from 'src/app/model/appartment/appartment';
import { Evenement } from 'src/app/model/evenement/evenement';
import { AppartmentService } from 'src/app/service/appartment/appartment.service';
import { EvenementService } from 'src/app/service/evenement/evenement.service';

@Component({
  selector: 'app-evenement',
  templateUrl: './evenement.component.html',
  styleUrls: ['./evenement.component.css']
})
export class EvenementComponent implements OnInit {

  eventRequest!: FormGroup;
  eventList: Evenement[] = [];
  appartements: any[] = [];

  pageNo = 0;
  pageSize = 10;
  totalPages = 0;


  constructor(
    private formBuilder: FormBuilder,
    private appartmentService: AppartmentService,
    private eventService: EvenementService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void
  {
    this.initForm();
    this.all();
    this.allAppartements();
  }

  initForm()
  {
    this.eventRequest = this.formBuilder.group({
      id: [''],
      sujet: ['', [Validators.required]],
      description: ['', [Validators.required]],
      dateEvenement: ['', [Validators.required]],
      appartementId: ['', [Validators.required]],
    });
  }

  all()
  {
    this.eventService.all(this.pageNo, this.pageSize).subscribe(
      (res: Evenement[]) => {
        let tempList: any[] = [];

        res.forEach(event => {

          this.appartmentService.getById(event.appartementId).subscribe((response) => {
            console.log('appartement info : ', response);
            event.appartment = response
            console.log("event : ", event);
            console.log('Temp liste : ', tempList);
          });

          tempList.push(event);
        });

        this.eventList = tempList;
        console.log('Evenement avec appartement', this.eventList);

        this.totalPages = Math.ceil(res.length / this.pageSize);
        console.log('Evenement fetched successfully:', res);
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
      console.log('Appartement :',this.appartements);
    });
  }

  onSaveEvent()
  {
    this.markFormGroupTouched(this.eventRequest);

    console.log('this.eventRequest.value : ',this.eventRequest.value);
    if (this.eventRequest.valid)
    {
      this.eventService.saveEvenement(this.eventRequest.value).subscribe(
        (response) => {
          console.log('Evenement saved successfully.',response);

          this.all();
          this.eventRequest.reset();
          this.toastr.success('Evenement saved successfully.');
        },
        (error) => {
          console.log('error ', error);
          this.toastr.error('Something went wrong, please try again.');
        }
      );
    }
  }

  onUpdateEvent()
  {
    this.markFormGroupTouched(this.eventRequest);

    console.log('Event edit : ', this.eventRequest.value);


    if (this.eventRequest.valid) {
      this.eventService.updateEvenement(
        this.eventRequest.value.id,
        this.eventRequest.value
      ).subscribe(
        (response) => {
          this.all();
          this.toastr.success('Evenement updated successfully.');
        },
        (error) => {
          console.log('error ', error);
          this.toastr.error('Something went wrong, please try again.');
        }
      );
    }
  }

  onDeleteEvent()
  {
    console.log('this.agenceRequest.value : ', this.eventRequest.value);
    this.eventService.deleteEvenement(
      this.eventRequest.value.id
    ).subscribe((response) => {
      console.log('Evenement deleted successfully:', response);
      this.all();
      this.toastr.success("Evenement deleted successfully.");

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

  editEvent(event: Evenement)
  {
    const appartement = this.appartements.find(appartement => appartement.id === event.appartementId);

    console.log("immeuble", appartement);

    this.eventRequest.setValue({
      id: event.id,
      sujet: event.sujet,
      description: event.description,
      dateEvenement: event.dateEvenement,
      appartementId: event.appartementId,
    });

    console.log('Evenement modifié : ', this.eventRequest.value);
  }

  deleteEvent(event: Evenement)
  {
    this.eventRequest.patchValue({
      id: event.id
    });
  }
}
