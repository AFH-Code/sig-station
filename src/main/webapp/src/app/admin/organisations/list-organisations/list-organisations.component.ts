import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommunService } from 'src/app/services/commun.service';
import { OrganisationService } from 'src/app/services/organisations/organisation.service';
import { loadingRoles } from '../../../helpers/appSettings';
import { TokenStorageService } from 'src/app/services/token-storage.service';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-list-organisations',
  templateUrl: './list-organisations.component.html',
  styleUrls: ['./list-organisations.component.scss']
})
export class ListOrganisationsComponent implements OnInit, OnDestroy{

  sub!:Subscription;

  config = {
    id: 'group',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0,
  };

  req: any = {
    tail: 10,
    page: 1,
  };

  organisations: any=[];
  currentId: number = 0;
  headerResponseName = 'X-Total-Count'; 
  keywordSearch: string = '';
  currentPage: number = 0;
  itemsPerPage: number = 10;
  countItemOrganisation: any;
  deleteCollection = { action: '', message: 'Supprimer cette ligne ?', id: 'sppmodal-container-confirm' };
  stationForm: FormGroup = this.formBuilder.group({
    keyword: ['', Validators.required]
  });

  form: any = {};
  isLoadingOperator=false;
  loadingRoles=loadingRoles;
  currentUser: any;

  constructor(private organisationService: OrganisationService, private formBuilder: FormBuilder, private communService: CommunService, private tokenStorage: TokenStorageService) {}

  ngOnInit(): void {
    this.currentUser = this.tokenStorage.getCurrentUser();
    this.loadOrganisation();

    this.sub = this.organisationService.updateRefresh$.subscribe({
      next: (data: any) => {
        console.log(data);
        if(data.type == 'refresh')
        {
          this.refesh();
        }
      },
    });
  }

  ngOnDestroy(): void {
    if(this.sub){
      this.sub.unsubscribe();
    }
  }

  openNewOrganisationModal():void
  {
    $('#newEvent').modal('show');
    this.organisationService.setDataOrganisation({'organisation': '', 'type': 'add'});
  }

  onSubmit(form: NgForm): void {
    console.log(this.form);
    this.config.currentPage = 1;
    this.req.page = 1;
    this.keywordSearch = this.form.keyword;
    //this.loadStation(false);
  }

  refesh(): void{
    this.loadOrganisation();
  }

  onFilter(type: string, value?: any): void {
    if (type === 'PAGE') {
      this.config.currentPage = value;
      this.req.page = value;
      console.log(this.req.page)
      this.loadOrganisation();
    }
  }

  update(organisation: any): void {
    $('#newEvent').modal('show');
    this.organisationService.setDataOrganisation({'organisation': organisation, 'type': 'update'});
  }

  deleteItem(id: number): void {
    this.currentId = id;
    $('#sppmodal-container-confirm').removeClass('out').addClass('one');
    $('body').addClass('sppmodal-active');
  }

  onDeleteCollection(ev: boolean): void {
    if (ev) {
      console.log(this.currentId);

      this.organisationService.deleteOrganisation(this.currentId).subscribe({
        next: (response) => {
          console.log(response);
          this.communService.setConfirm(true);
          this.loadOrganisation();
        },
        error: err => console.log(err),
        complete: () => console.log('complete')
      })
    }
  }

  loadOrganisation(dropdownSelect: boolean = false): any{
    this.organisationService.getOrganisationsStats(this.req.page -1,this.req.tail, this.keywordSearch).subscribe({
      next: (response) => {
        console.log(response);
        this.organisations = response;
        this.countItemOrganisation = response.length;
        this.config.totalItems = this.countItemOrganisation;
        this.isLoadingOperator = true;
      },
      error: err => console.log(err),
      complete: () => console.log('complete')
    })
  }
}
