import { Component, OnDestroy, OnInit } from '@angular/core';
import { StationService } from 'src/app/services/stations/station.service';
import { FormGroup, FormBuilder, Validators, FormArray, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommunService } from 'src/app/services/commun.service';
import { loadingRoles } from '../../../helpers/appSettings';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { OrganisationService } from 'src/app/services/organisations/organisation.service';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-list-station',
  templateUrl: './list-station.component.html',
  styleUrls: ['./list-station.component.scss']
})

export class ListStationComponent implements OnInit, OnDestroy{

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
  currentId: number = 0;
  stations: any=[];
  headerResponseName = 'X-Total-Count'; 
  keywordSearch: string = '';
  currentPage: number = 0;
  itemsPerPage: number = 10;
  typeCouche: string[] = ['VSAT', 'PDH', 'SDH', 'PTMP', 'OU_AD', 'NEW'];
  countItemStation: any;
  deleteCollection = { action: '', message: 'Supprimer cette ligne ?', id: 'sppmodal-container-confirm' };
  stationForm: FormGroup = this.formBuilder.group({
    keyword: ['', Validators.required]
  });
  form: any = {};

  isLoadingStation=false;
  currentUser: any;

  keywordName = 'ownerName';
  organisations: any=[];

  operatorForm: FormGroup = this.formBuilder.group({
    operatorName: ['']
  });
  formoperator: any = {};
  currentOperator: any = null;
  loadingRoles = loadingRoles;


  constructor(private stationService: StationService, private formBuilder: FormBuilder, 
    private communService: CommunService, private tokenStorage: TokenStorageService, private organisationService: OrganisationService) {}

  ngOnInit(): void {
    this.currentUser = this.tokenStorage.getCurrentUser();
    this.loadStation();
    this.loadOrganisation();

    this.sub = this.stationService.updateRefresh$.subscribe({
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

  onFilter(type: string, value?: any): void {
    if (type === 'PAGE') {
      this.config.currentPage = value;
      this.req.page = value;
      console.log(this.req.page)
      this.loadStation();
    }
  }

  loadStation(dropdownSelect: boolean = false): any{
      let loadOperator = this.currentOperator;
      this.stationService.getStationCountry(this.req.page -1,this.req.tail, this.typeCouche, this.keywordSearch, loadOperator).subscribe({
        next: (response) => {
          console.log(response);
          this.stations = response.principalStation.body;
          this.countItemStation = Number(response.principalStation.headers[this.headerResponseName][0]);
          this.config.totalItems = this.countItemStation;
          this.isLoadingStation = true;
        },
        error: err => console.log(err),
        complete: () => console.log('complete')
      })
  }

  update(annonce: any): void {
    $('#newEvent').modal('show');
    this.stationService.setDataStation({'annonce': annonce, 'type': 'update'});
  }

  openNewStationModal():void
  {
    $('#newEvent').modal('show');
    this.stationService.setDataStation({'annonce': '', 'type': 'add'});
  }

  onSubmit(form: NgForm): void {
    console.log(this.form);
    this.config.currentPage = 1;
    this.req.page = 1;
    this.keywordSearch = this.form.keyword;
    this.loadStation(false);
  }

  refesh(): void{
    this.loadStation(false);
  }

  detailStation(station: any): void{
    console.log('Resolver Station');
  }

  deleteItem(id: number): void {
    this.currentId = id;
    $('#sppmodal-container-confirm').removeClass('out').addClass('one');
    $('body').addClass('sppmodal-active');
  }

  onDeleteCollection(ev: boolean): void {
    if (ev) {

      setTimeout(() => {
        this.communService.setConfirm(true);
      }, 1000);

    }
  }

  changeStatusItem(id: number): void
  {
    this.isLoadingStation = false;
    this.stations = [];
    this.stationService.changeStatusItem(id).subscribe({
      next: (response) => {
        console.log(response);
        this.refesh();
      },
      error: err => console.log(err),
      complete: () => console.log('complete')
    })
  }

  loadOrganisation(dropdownSelect: boolean = false): any{
    this.organisationService.getOrganisations(0,500, '').subscribe({
      next: (response) => {
        console.log(response);
        this.organisations = response;
      },
      error: err => console.log(err),
      complete: () => console.log('complete')
    })
  }


  selectEvent(item: any) {
    // do something with selected item
    console.log(item);
    this.currentOperator = item;
    this.loadStation();
  }

  onChangeSearchOperateur(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    console.log(val);

  }
  
  onFocused(e: any){
    // do something when input is focused
  }

  onClearButtonClick(){
    console.log('Clear Operator');
    this.currentOperator = null;
    this.loadStation();
  }
}

