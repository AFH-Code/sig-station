import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrganisationService } from 'src/app/services/organisations/organisation.service';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-organisation-modal',
  templateUrl: './organisation-modal.component.html',
  styleUrls: ['./organisation-modal.component.scss']
})
export class OrganisationModalComponent implements OnInit, OnDestroy{

  sub!:Subscription;
  userForm: FormGroup = this.formBuilder.group({
    ownerName: ['', Validators.required],
    ownerAdress: ['', Validators.required],
    telephone: ['', Validators.required],
    fax: ['', Validators.required],
    email: ['', Validators.required],
    id: ['']
  });
  typeFormOperation: String = 'Créer un compte utilisateur';
  form: any = {};

  keyword = 'name';

  constructor(private formBuilder: FormBuilder, private organisationService: OrganisationService, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void{
    this.sub = this.organisationService.dataRefresh$.subscribe({
      next: (data: any) => {
        console.log(data);
        if(data.type == 'update')
        {
          this.updateFrom(data.organisation);
        }else{
          this.form = {};
          this.typeFormOperation = 'Créer une organisation';
        }
      },
    });
  }

  ngOnDestroy(): void {
    if(this.sub){
      this.sub.unsubscribe();
    }
  }

  updateFrom(organisation: any): void {
    this.form.ownerName = organisation.ownerName;
    this.form.ownerAdress = organisation.ownerAdress;
    this.form.telephone = organisation.telephone;
    this.form.fax = organisation.fax;
    this.form.email = organisation.email;
    this.form.id = organisation.id;
    this.typeFormOperation = 'Modifiez cette station';
  }

  onSubmit(form: NgForm): void {
    console.log(this.form);

    if(this.form.id > 0)
    {
      console.log(this.form.id);
      this.organisationService.updateOrganisation(this.form).subscribe({
        next: (response) => {
          console.log(response);
          this.toastr.success('Avec succès', 'Modification effectuée');
          $('#newEvent').modal('hide');
          //this.router.navigate(['admin/u?page=1']);
          this.organisationService.setDataUpdate({'type': 'refresh'});
        },
        error: err => console.log(err),
        complete: () => console.log('complete')
      })
    }else{
      this.organisationService.saveOrganisation(this.form).subscribe({
        next: (response) => {
          console.log(response);
          this.toastr.success('Avec succès', 'Organisation crée');
          $('#newEvent').modal('hide');
          this.organisationService.setDataUpdate({'type': 'refresh'});
        },
        error: err => console.log(err),
        complete: () => console.log('complete')
      })
    }
  }

}
