import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AgenceRequest } from 'src/app/model/agence/agence-request';
import { AgenceResponse } from 'src/app/model/agence/agence-response';
import { AgenceService } from 'src/app/service/agence/agence.service';

@Component({
  selector: 'app-agence-list',
  templateUrl: './agence-list.component.html',
  styleUrls: ['./agence-list.component.css']
})
export class AgenceListComponent implements OnInit {

  agenceList: AgenceResponse[] = [];
  agenceRequest!: FormGroup;
  agenceImages: File[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private agenceService: AgenceService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void
  {
    this.initForm();
    this.all();
  }

  initForm()
  {
    this.agenceRequest = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      multipartFiles: this.formBuilder.array([])
    });
  }

  onFileChange(event: Event)
  {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.agenceImages = Array.from(target.files);
    }
  }

  onSave()
  {
    this.markFormGroupTouched(this.agenceRequest);

    if(this.agenceRequest.valid)
    {
      const formValue = this.agenceRequest.value;

      // Créez un nouvel objet FormData
      const formData = new FormData();
      formData.append('name', formValue.name);
      formData.append('address', formValue.address);
      formData.append('telephone', formValue.telephone);
      formData.append('email', formValue.email);

      // Ajoutez chaque fichier sélectionné à formData
      for (let i = 0; i < this.agenceImages.length; i++) {
        formData.append('multipartFiles', this.agenceImages[i]);
      }

      // Envoyez formData au serveur via le service AgenceService
      this.agenceService.saveAgence(formData).subscribe(
        (response) => {
          console.log('Agence saved successfully:', response);

          this.toastr.success("Agence created successfully.")
          this.agenceRequest.reset();
          this.agenceImages = [];
        },
        (error) => {
          console.error('Error while saving agence:', error);
          this.toastr.error("Something went wrong please try again.")

        }
      );
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

  all() {
    this.agenceService.all().subscribe(
      (res: AgenceResponse[]) => {
        this.agenceList = res;
        console.log('Agences fetched successfully:', res);
      },
      (error: any) => {
        console.error('Error while fetching agences:', error);
      }
    );
  }

  // editAgence(agence: AgenceResponse) {
  //   this.agenceRequest.patchValue({
  //     id: agence.agenceDto.id,
  //     name: agence.agenceDto.name,
  //     email: agence.agenceDto.email,
  //     address: agence.agenceDto.address,
  //     telephone: agence.agenceDto.telephone,
  //     multipartFiles: agence.medias.map(media => media.uri)
  //   });
  // }
}
