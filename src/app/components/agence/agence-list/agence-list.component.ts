import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AgenceRequest } from 'src/app/model/agence/agence-request';
import { AgenceResponse } from 'src/app/model/agence/agence-response';
import { AgenceService } from 'src/app/service/agence/agence.service';

@Component({
  selector: 'app-agence-list',
  templateUrl: './agence-list.component.html',
  styleUrls: ['./agence-list.component.css']
})
export class AgenceListComponent implements OnInit {

  agenceRequest!: FormGroup;
  agenceList: AgenceResponse[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private agenceService: AgenceService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.all();
  }

  initForm() {
    this.agenceRequest = this.formBuilder.group({
      name: [''],
      address: [''],
      telephone: [''],
      email: [''],
      multipartFiles: [null]
    });
  }

  onSave() {
    const formData = new FormData();
    formData.append('name', this.agenceRequest.value.name);
    formData.append('address', this.agenceRequest.value.address);
    formData.append('telephone', this.agenceRequest.value.telephone);
    formData.append('email', this.agenceRequest.value.email);

    const files = this.agenceRequest.value.multipartFiles;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append('multipartFiles', files[i]);
      }
    }

    this.agenceService.saveAgence(formData).subscribe(
      (res: any) => {
        console.log('Agence saved successfully:', res);
        this.initForm();
        this.all();
      },
      (error: any) => {
        console.error('Error while saving the agence:', error);
      }
    );
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

  editAgence(agence: AgenceResponse) {
    this.agenceRequest.patchValue({
      id: agence.agenceDto.id,
      name: agence.agenceDto.name,
      email: agence.agenceDto.email,
      address: agence.agenceDto.address,
      telephone: agence.agenceDto.telephone,
    });

    if (agence.medias) {
      const files: File[] = [];
      agence.medias.forEach(file => {
        const newFile = new File([], file.uri);
        files.push(newFile);
      });
      this.agenceRequest.patchValue({ multipartFiles: files });
    }
  }

}
