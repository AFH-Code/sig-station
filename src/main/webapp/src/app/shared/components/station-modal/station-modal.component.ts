import { Component, OnDestroy, OnInit } from '@angular/core';
import { ArrondissementService } from '../../../services/localite/arrondissement.service';
import { StationService } from '../../../services/stations/station.service';
import { FormGroup, FormBuilder, Validators, FormArray, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrganisationService } from 'src/app/services/organisations/organisation.service';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-station-modal',
  templateUrl: './station-modal.component.html',
  styleUrls: ['./station-modal.component.scss']
})
export class StationModalComponent implements OnInit, OnDestroy {

  sub!:Subscription;
  keyword = 'name_3';
  arrondissements: any = [];
  stationForm: FormGroup = this.formBuilder.group({
    stationName: ['', Validators.required],
    latitudeStation: ['', Validators.required],
    longitudeStation: ['', Validators.required],
    serviceRadius: ['', Validators.required],
    heightService: ['', Validators.required],
    arrondissementStation: ['', Validators.required],
    typeStation: ['', Validators.required],
    stationType: ['', Validators.required],
    organisationStation: [''],
    id: ['']
  });
  typeFormOperation: String = 'Créer une nouvelle station';
  form: any = {};

  deviceObjects: any = [
    { id: 1, name: 'VSAT' },
    { id: 2, name: 'PDH' },
    { id: 3, name: 'SDH' },
    { id: 4, name: 'PTMP' },
    { id: 4, name: 'OU_AD' },
    { id: 4, name: 'NEW' }
  ];
  selectedDeviceObj = this.deviceObjects[1];

  keywordName = 'ownerName';
  organisations: any = [];
  
  constructor(private arrondissementService: ArrondissementService, private formBuilder: FormBuilder,
  private stationService: StationService, private toastr: ToastrService, private router: Router, private organisationService: OrganisationService) { }

  ngOnInit(): void{
    this.sub= this.stationService.dataRefresh$.subscribe({
      next: (data: any) => {
        console.log(data);
        if(data.type == 'update')
        {
          this.updateFrom(data.annonce);
        }else{
          this.form = {};
          this.typeFormOperation = 'Créer une nouvelle station';
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

  updateFrom(station: any): void {
    this.form.stationName = station.stationName;
    this.form.latitudeStation = station.latitude;
    this.form.longitudeStation = station.longitude;
    this.form.serviceRadius = station.radiusOfService;
    this.form.heightService = station.heightASL;
    this.form.stationType = station.typeStation;
    this.form.arrondissementStation = station.arrondissement;
    this.form.organisationStation = station.operator;
    this.selectedDeviceObj = {};
    for(var i=0; i < this.deviceObjects.length; i++)
    {
      if(this.deviceObjects[i].name == station.type)
      {
        this.form.typeStation = this.deviceObjects[i].id;
      }
    }
    this.form.id = station.id;
    this.typeFormOperation = 'Modifiez cette station';
  }

  selectEvent(item: any) {
    // do something with selected item
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    console.log(val);

    this.arrondissementService.searchArrondissement(val)
      .subscribe({
        next: (response: any)=>{
          this.arrondissements = response;
            console.log(response);
        },
        error: (error: any) => {
          console.log(error);
        }
      });
  }

  onChangeSearchOperateur(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    console.log(val);

  }
  
  onFocused(e: any){
    // do something when input is focused
  }

  onChangeObj(newObj: any)
  {
    console.log(newObj);
    this.selectedDeviceObj = newObj;
  }

  onSubmit(form: NgForm): void {
    console.log(this.form);

    this.form.typeStation = this.deviceObjects[this.form.typeStation];
    if(this.form.id > 0)
    {
      console.log(this.form.id)
      console.log(this.form.arrondissementStation.id)
      console.log(this.form.typeStation.name)

      this.stationService.updateStation(this.form).subscribe({
        next: (response) => {
          console.log(response);
          this.toastr.success('Avec succès', 'Modification effectuée');
          $('#newEvent').modal('hide');
          this.stationService.setDataUpdate({'type': 'refresh'});
        },
        error: err => console.log(err),
        complete: () => console.log('complete')
      })
    }else{

      this.stationService.saveStation(this.form).subscribe({
        next: (response) => {
          console.log(response);
          this.toastr.success('Avec succès', 'Compte crée');
          $('#newEvent').modal('hide');
          this.stationService.setDataUpdate({'type': 'refresh'});
        },
        error: err => console.log(err),
        complete: () => console.log('complete')
      })
    }
  }
}
