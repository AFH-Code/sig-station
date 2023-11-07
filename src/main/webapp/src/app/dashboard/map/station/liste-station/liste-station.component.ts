
import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, NgForm } from '@angular/forms';
import { StationService } from '../../../../services/stations/station.service';
import { HttpResponse } from '@angular/common/http';
import { TokenStorageService } from 'src/app/services/token-storage.service';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-liste-station',
  templateUrl: './liste-station.component.html',
  styleUrls: ['./liste-station.component.scss']
})
export class ListeStationComponent implements OnInit {

  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings:IDropdownSettings = {};

  stationForm: FormGroup = this.formBuilder.group({
    keyword: ['', Validators.required]
  });
  form: any = {};
  keywordSearch: string = '';
  stations: any=[]; 
  isLoading=false;
  currentPage: number = 0;
  itemsPerPage: number = 20; 

  toggleLoading = () =>this.isLoading=!this.isLoading;

  type_localite: string = '';
  headerResponseName = 'X-Total-Count';
  currentObjet_detail : string = '';
  id_localite: number = 0;
  countItemStation: any;
  typeCouche: string[] = ['VSAT', 'PDH', 'SDH', 'PTMP', 'OU_AD', 'NEW'];
  currentUser: any;
  
  constructor(private stationService: StationService, private actRoute: ActivatedRoute, private tokenStorage: TokenStorageService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.currentUser = this.tokenStorage.getCurrentUser();

    this.actRoute.paramMap.subscribe(params =>{
      this.type_localite = params.get('typeLocalite') ?? 'country';
      this.id_localite = Number(params.get('localiteId')) ?? 0;
      console.log(this.type_localite);
      console.log(this.id_localite);

      this.loadData();
      this.getCurrentObjet();

      this.stationService.setData({'type_localite': this.type_localite, 'id_localite': this.id_localite, 'dataObject': null});

    });

    this.actRoute.queryParamMap
      .subscribe(params => {
        console.log(params);
        var itemCouche: string[] = params.getAll('type') ?? [];
        if(itemCouche.length > 0)
        {
          this.typeCouche = itemCouche;
        }
        console.log(this.typeCouche);
        this.currentPage = Number(params.get('page')) ?? 1;
        this.itemsPerPage = Number(params.get('tail')) ?? 20;
        if(this.currentPage == 0)
        {
          this.currentPage = 0;
        }
        if(this.itemsPerPage == 0)
        {
          this.itemsPerPage = 20;
        }
      }
    );

    this.dropdownList = [
      { item_id: 1, item_text: 'VSAT' },
      { item_id: 2, item_text: 'PDH' },
      { item_id: 3, item_text: 'SDH' },
      { item_id: 4, item_text: 'PTMP' },
      { item_id: 4, item_text: 'OU_AD' },
      { item_id: 4, item_text: 'NEW' }
    ];

    this.selectedItems = [
      { item_id: 1, item_text: 'VSAT' },
      { item_id: 2, item_text: 'PDH' },
      { item_id: 3, item_text: 'SDH' },
      { item_id: 4, item_text: 'PTMP' },
      { item_id: 4, item_text: 'OU_AD' },
      { item_id: 4, item_text: 'NEW' }
    ];
    
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.initSecondPanel();
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  closeDropdown(item: any)
  {
    this.loadData(true,'');
  }

  initSecondPanel(){
    $('#station_list').toggleClass('active');
  }

  // it will be called when this component gets initialized.
  loadData= (dropdownSelect: boolean = false, searchKey: string = '')=>{
    this.toggleLoading();
    this.currentPage = 0;

    if(dropdownSelect == true)
    {
      this.typeCouche = [];
      for(let item of this.selectedItems)
      {
        this.typeCouche.push(item.item_text);
      }
    }

    //alert(this.currentUser.role)
    if(this.type_localite == 'country'){
      
      this.stationService.getStationCountry(this.currentPage,this.itemsPerPage, this.typeCouche, searchKey).subscribe({
        next: (response) => {
          console.log(response);
          this.stations = response.principalStation.body;
          this.countItemStation = Number(response.principalStation.headers[this.headerResponseName][0]);
        },
        error: err => console.log(err),
        complete: () => this.toggleLoading()
      })

    }else if(this.type_localite == 'region'){

      this.stationService.getStationRegion(this.currentPage,this.itemsPerPage, this.typeCouche, this.id_localite, searchKey).subscribe({
        next: (response: any) => {
          //console.log(response);
          console.log('end');
          this.stations = response.principalStation.body;

          console.log(response);
          this.countItemStation = Number(response.principalStation.headers[this.headerResponseName][0]);
        },
        error: err => console.log(err),
        complete: () => this.toggleLoading()
      })
      
    }else if(this.type_localite == 'departement'){

      this.stationService.getStationDepartement(this.currentPage,this.itemsPerPage, this.typeCouche, this.id_localite, searchKey).subscribe({
        next: (response: any) => {
          //console.log(response);
          console.log('end');
          this.stations = response.principalStation.body;
          if(this.stations.length > 0)
          {
            let firstStation = this.stations[0];
            this.stationService.setData({'type_localite': this.type_localite, 'id_localite': this.id_localite, 'dataObject': firstStation});
          }
          this.countItemStation = Number(response.principalStation.headers[this.headerResponseName][0]);
        },
        error: err => console.log(err),
        complete: () => this.toggleLoading()
      })

    }else if(this.type_localite == 'arrondissement'){

      console.log(this.typeCouche)
      this.stationService.getStationArrondissement(this.currentPage,this.itemsPerPage, this.typeCouche, this.id_localite, searchKey).subscribe({
        next: (response: any) => {
          //console.log(response);
          this.stations = response.principalStation.body;
          if(this.stations.length > 0)
          {
            let firstStation = this.stations[0];
            this.stationService.setData({'type_localite': this.type_localite, 'id_localite': this.id_localite, 'dataObject': firstStation});
          }
          this.countItemStation = Number(response.principalStation.headers[this.headerResponseName][0]);
        },
        error: err => console.log(err),
        complete: () => this.toggleLoading()
      })

    }
  }
  
  // this method will be called on scrolling the page
  appendData = ()=>{
   this.toggleLoading();

   if(this.type_localite == 'country'){

    this.stationService.getStationCountry(this.currentPage,this.itemsPerPage, this.typeCouche, this.keywordSearch).subscribe({
      next: (response: any)=>{
        console.log(response);
        this.stations = [...this.stations,...response.principalStation.body]
      },
      error:err=>console.log(err),
      complete:()=>this.toggleLoading()
    })

    }else if(this.type_localite == 'region'){

      this.stationService.getStationRegion(this.currentPage,this.itemsPerPage, this.typeCouche, this.id_localite, this.keywordSearch).subscribe({
        next: (response: any) => {
          console.log(response);
          this.stations = [...this.stations,...response.principalStation.body];
        },
        error: err => console.log(err),
        complete: () => this.toggleLoading()
      })
      
    }else if(this.type_localite == 'departement'){

      this.stationService.getStationDepartement(this.currentPage,this.itemsPerPage, this.typeCouche, this.id_localite, this.keywordSearch).subscribe({
        next: (response: any) => {
          //console.log(response);
          console.log('end');
          this.stations = [...this.stations,...response.principalStation.body];
        },
        error: err => console.log(err),
        complete: () => this.toggleLoading()
      })

    }else if(this.type_localite == 'arrondissement'){

      this.stationService.getStationArrondissement(this.currentPage,this.itemsPerPage, this.typeCouche, this.id_localite, this.keywordSearch).subscribe({
        next: (response: any) => {
          //console.log(response);
          console.log('end');
          this.stations = [...this.stations,...response.principalStation.body];
        },
        error: err => console.log(err),
        complete: () => this.toggleLoading()
      })
    }
 }

 getCurrentObjet()
 {
    if(this.type_localite == 'country'){
      this.currentObjet_detail = 'Toutes les stations du pays';
    }else if(this.type_localite == 'region'){
      this.stationService.getDetailRegion(this.id_localite).subscribe({
        next: (response: any) => {
          console.log(response);
          this.currentObjet_detail = 'Stations de la région '+response.name_1;
        },
        error: err => console.log(err),
        complete: () => console.log('end check Region')
      })
    }else if(this.type_localite == 'departement'){
      this.stationService.getDetailDepartement(this.id_localite).subscribe({
        next: (response: any) => {
          console.log(response);

          this.currentObjet_detail = 'Stations du département '+response.name_2;
        },
        error: err => console.log(err),
        complete: () => console.log('end check Département')
      })
    }else if(this.type_localite == 'arrondissement'){
      this.stationService.getDetailArrondissement(this.id_localite).subscribe({
        next: (response: any) => {
          console.log(response);
          this.currentObjet_detail = 'Stations de l\'arrondissement '+response.name_3;
        },
        error: err => console.log(err),
        complete: () => console.log('end check Arrondissement')
      })
    }
 }

  onScroll= ()=>{
   this.currentPage++;
   this.appendData();
  }


  onScrollDown() {
    console.log("scrolled down!!");
  }

  onScrollUp() {
    console.log("scrolled up!!");
  }

  openMapPoint(idStation: number): any{
    
    
    this.stationService.setData({'type_localite': 'station', 'id_localite': idStation});

  }

  onSubmit(form: NgForm): void {
    console.log(this.form);
    this.keywordSearch = this.form.keyword;
    this.loadData(false, this.keywordSearch);
  }

}
