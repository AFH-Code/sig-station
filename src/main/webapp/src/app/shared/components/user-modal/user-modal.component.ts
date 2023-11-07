import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/users/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrganisationService } from 'src/app/services/organisations/organisation.service';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent implements OnInit, OnDestroy{

  sub!:Subscription;
  userForm: FormGroup = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    role: ['', Validators.required],
    organisationUser: [''],
    enabled: [''],
    id: ['']
  });
  typeFormOperation: String = 'Créer un compte utilisateur';
  form: any = {};

  roleObjects: any = [
    { id: 1, name: 'USER' },
    { id: 2, name: 'ADMIN' },
    { id: 3, name: 'ADMIN_ORG' },
    { id: 4, name: 'SUPER_ADMIN_ORG' }
  ];
  selectedRoleObj = this.roleObjects[1];
  typePassInput: String = 'text';
  organisations: any = [];
  keyword = 'ownerName';

  constructor(private formBuilder: FormBuilder, private userService: UserService, private toastr: ToastrService, private router: Router, private organisationService: OrganisationService) { }

  ngOnInit(): void{
    this.sub = this.userService.dataRefresh$.subscribe({
      next: (data: any) => {
        console.log(data);
        if(data.type == 'update')
        {
          this.updateFrom(data.user);
        }else{
          this.form = {};
          this.typeFormOperation = 'Créer un compte utilisateur';
        }
      },
    });

    this.organisationService.getOrganisations()
      .subscribe({
        next: (response: any)=>{
          this.organisations = response;
            console.log(response);
            console.log('Data Res');
        },
        error: (error: any) => {
          console.log(error);
        }
    });
  }

  ngOnDestroy(): void {
    if(this.sub){
      this.sub.unsubscribe();
    }
  }

  onSubmit(form: NgForm): void {
    console.log(this.form);

    if(this.form.id > 0)
    {
      console.log(this.form.id);
      this.userService.updateUser(this.form).subscribe({
        next: (response) => {
          console.log(response);
          this.toastr.success('Avec succès', 'Modification effectuée');
          $('#newEvent').modal('hide');
          //this.router.navigate(['admin/u?page=1']);
          this.userService.setDataUpdate({'type': 'refresh'});
        },
        error: err => console.log(err),
        complete: () => console.log('complete')
      })
    }else{
      this.userService.saveUser(this.form).subscribe({
        next: (response) => {
          console.log(response);
          this.toastr.success('Avec succès', 'Compte crée');
          $('#newEvent').modal('hide');
          this.userService.setDataUpdate({'type': 'refresh'});
        },
        error: err => console.log(err),
        complete: () => console.log('complete')
      })
    }
  }

  onChangeObj(newObj: any)
  {
    console.log(newObj);
    this.selectedRoleObj = newObj;

    if(newObj.name == 'ADMIN_ORG')
    {
      console.log(newObj.name)
    }
  }

  updateTypeInput(){
    if(this.typePassInput == 'text')
    {
      this.typePassInput = 'password';
    }else{
      this.typePassInput = 'text';
    }
  }

  updateFrom(user: any): void {
    this.form.firstName = user.firstname;
    this.form.lastName = user.lastname;
    this.form.email = user.email;
    //this.form.password = user.password;
    this.form.role = user.role;
    this.form.organisationUser = user.operator;
    this.selectedRoleObj = {};
    for(var i=0; i < this.roleObjects.length; i++)
    {
      if(this.roleObjects[i].name == user.role)
      {
        this.form.role = this.roleObjects[i].name;
      }
    }
    this.form.id = user.id;
    this.typeFormOperation = 'Modifiez ce compte utilisateur';
  }


  selectEvent(item: any) {
    // do something with selected item
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    console.log(val);

  }
  
  onFocused(e: any){
    // do something when input is focused
  }
}
