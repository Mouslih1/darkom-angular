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

  agenceImages: any[] = [];
  pageNo = 0;
  pageSize = 10;
  totalPages = 0;
  isModalVisible: boolean = true;

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
      id: [''],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      multipartFiles: this.formBuilder.array([], [Validators.required])
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

      const formData = new FormData();
      formData.append('name', formValue.name);
      formData.append('address', formValue.address);
      formData.append('telephone', formValue.telephone);
      formData.append('email', formValue.email);

      for (let i = 0; i < this.agenceImages.length; i++) {
        formData.append('multipartFiles', this.agenceImages[i]);
      }

      this.agenceService.saveAgence(formData).subscribe(
        (response) => {
          console.log('Agence saved successfully:', response);

          this.all();
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

  onUpdate()
  {
    console.log(this.agenceRequest.value);
    this.agenceService.updateAgenceInfo(
      this.agenceRequest.value.id,
      this.agenceRequest.value
    ).subscribe((response) => {
      console.log('Agence updated successfully:', response);
      this.all();
      this.toastr.success("Agence info updated successfully.")
    },
    (error) => {
      console.error('Error while updated agence:', error);
      this.toastr.error("Something went wrong please try again.")
    });
  }

  onUpdateLogo()
  {
    console.log(this.agenceRequest.value);
    console.log(this.agenceImages);

    console.log('this.agenceRequest.value.id : ', this.agenceRequest.value.id);
    const formData = new FormData();

    for (let i = 0; i < this.agenceImages.length; i++) {
      formData.append('multipartFiles', this.agenceImages[i]);
    }

    this.agenceService.updateAgenceLogo(
      this.agenceRequest.value.id,
      formData
    ).subscribe((response) => {
      console.log('Agence logo updated successfully:', response);
      this.all();
      this.toastr.success("Agence logo updated successfully.")
    },
    (error) => {
      console.error('Error while updated agence:', error);
      this.toastr.error("Something went wrong please try again.")
    });
  }

  onDelete()
  {
    console.log('this.agenceRequest.value : ', this.agenceRequest.value);
    this.agenceService.deleteAgence(
      this.agenceRequest.value.id
    ).subscribe((response) => {
      console.log('Agence deleted successfully:', response);
      this.all();
      this.toastr.success("Agence deleted successfully.");
      this.isModalVisible = false;

    },
    (error) => {
      console.error('Error while delete agence:', error);
      this.toastr.error("Something went wrong please try again.")
    });
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

  previousPage()
  {
    if (this.pageNo > 0)
    {
      this.pageNo--;
      this.all();
    }
  }

  nextPage()
  {
    console.log(this.totalPages);
    console.log(this.pageNo);

    if (this.pageNo <= this.totalPages)
    {
      this.pageNo++;
      this.all();
    }
  }

  all() {
    this.agenceService.all(this.pageNo, this.pageSize).subscribe(
      (res: AgenceResponse[]) => {
        this.agenceList = res;
        this.totalPages = Math.ceil(res.length / this.pageSize);

        console.log('Agences fetched successfully:', res);
      },
      (error: any) => {
        console.error('Error while fetching agences:', error);
      }
    );
  }

  editAgence(agence: AgenceResponse)
  {
    console.log(agence);

    this.agenceRequest.patchValue({
      id: agence.agenceDto.id,
      name: agence.agenceDto.name,
      email: agence.agenceDto.email,
      address: agence.agenceDto.address,
      telephone: agence.agenceDto.telephone,
    });

    this.agenceImages = agence.medias.map(media => media.uri);
    console.log("agenceImages après affectation :", this.agenceImages);
  }

  editAgenceLogo(agence: AgenceResponse)
  {
    this.agenceRequest.patchValue({
      id: agence.agenceDto.id
    });
    this.agenceImages = agence.medias.map(media => media.uri);
  }

  deleteAgence(agence: AgenceResponse)
  {
    this.agenceRequest.patchValue({
      id: agence.agenceDto.id
    });
  }
}
