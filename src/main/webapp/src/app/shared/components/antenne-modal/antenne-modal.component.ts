import { Component, OnDestroy, OnInit } from '@angular/core';

import { StationService } from '../../../services/stations/station.service';
import { FormGroup, FormBuilder, Validators, FormArray, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AntennesService } from 'src/app/services/stations/antennes.service';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-antenne-modal',
  templateUrl: './antenne-modal.component.html',
  styleUrls: ['./antenne-modal.component.scss']
})
export class AntenneModalComponent implements OnInit, OnDestroy{

  sub!:Subscription;

  keyword = 'stationName';
  stations: any = [];
  antenneForm: FormGroup = this.formBuilder.group({
    antennaName: ['', Validators.required],
    azimutRadiation: ['', Validators.required],
    elevation: ['', Validators.required],
    antennaHeigth: ['', Validators.required],
    polarization: ['', Validators.required],
    stationAntenne: ['', Validators.required],
    antennaGain: ['', Validators.required],
    antennaDirectivity: [''],
    horBeamWidth: [''],
    rotAzimut: [''],
    antennaType: [''],
    antennaGainType: [''],
    antennaSize: [''],
    verBeamWidth: [''],
    referenceAntenna: [''],
    freqRangeFrom: [''],
    freqRangeTo: [''],
    crossPolarDisc: [''],
    insertionLoss: [''],
    id: ['']
  });
  typeFormOperation: String = 'Créer une nouvelle antenne';
  form: any = {};

  deviceObjects: any = [
    { id: 1, name: 'Parabolic' },
    { id: 2, name: 'Patch' },
    { id: 3, name: 'Yagui' },
    { id: 4, name: 'Circulaire' },
    { id: 4, name: 'Elyptique' }
  ];
  selectedDeviceObj = this.deviceObjects[1];

  typeCouche: string[] = ['VSAT', 'PDH', 'SDH', 'PTMP', 'OU_AD', 'NEW'];

  constructor(private formBuilder: FormBuilder,
    private stationService: StationService, private antennesService: AntennesService, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void{
    this.sub= this.antennesService.dataRefresh$.subscribe({
      next: (data: any) => {
        console.log(data);
        if(data.type == 'update')
        {
          this.updateFrom(data.antenne);
        }else{
          this.form = {};
          this.typeFormOperation = 'Créer une nouvelle antenne';
        }
      },
    });
  }

  ngOnDestroy(): void {
    if(this.sub){
      this.sub.unsubscribe();
    }
  }

  onChangeObj(newObj: any)
  {
    console.log(newObj);
    this.selectedDeviceObj = newObj;
  }

  onSubmit(form: NgForm): void {
    console.log(this.form);

    this.form.antennaType = this.deviceObjects[this.form.antennaType];
    if(this.form.id > 0)
    {
      this.antennesService.updateAntenne(this.form).subscribe({
        next: (response) => {
          console.log(response);
          this.toastr.success('Avec succès', 'Modification effectuée');
          $('#newEvent').modal('hide');
          this.antennesService.setDataUpdate({'type': 'refresh'});
        },
        error: err => console.log(err),
        complete: () => console.log('complete')
      })

    }else{

      this.antennesService.saveAntenne(this.form).subscribe({
        next: (response) => {
          console.log(response);

          this.toastr.success('Avec succès', 'Compte crée');
          $('#newEvent').modal('hide');
          this.antennesService.setDataUpdate({'type': 'refresh'});

        },
        error: err => console.log(err),
        complete: () => console.log('complete')
      })
    }
  }

  selectEvent(item: any) {
    // do something with selected item
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    console.log(val);

    this.stationService.getStationCountry(0, 500, this.typeCouche, val)
      .subscribe({
        next: (response: any)=>{
          this.stations = response.principalStation.body;
            console.log(response);
        },
        error: (error: any) => {
          console.log(error);
        }
      });
  }

  onFocused(e: any){
    // do something when input is focused
  }

  updateFrom(antenne: any): void {

    this.form.antennaName = antenne.antennaName;
    this.form.azimutRadiation = antenne.azimutRadiation;
    this.form.elevation = antenne.elevation;
    this.form.antennaHeigth = antenne.antennaHeigth;
    this.form.polarization = antenne.polarization;
    this.form.stationAntenne = antenne.principal_station;
    this.form.antennaGain = antenne.antennaGain;


    this.selectedDeviceObj = {};
    for(var i=0; i < this.deviceObjects.length; i++)
    {
      if(this.deviceObjects[i].name == antenne.antennaType)
      {
        this.form.antennaType = this.deviceObjects[i].id;
      }
    }
    this.form.id = antenne.id;
    this.typeFormOperation = 'Modifiez cette antenne';
  }

}
