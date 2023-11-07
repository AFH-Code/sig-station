import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AntennesService } from 'src/app/services/stations/antennes.service';
import { StationService } from 'src/app/services/stations/station.service';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-detail-station',
  templateUrl: './detail-station.component.html',
  styleUrls: ['./detail-station.component.scss']
})
export class DetailStationComponent implements OnInit, OnDestroy{

  sub!:Subscription;

  
  antennes: any=[];
  headerResponseName = 'X-Total-Count'; 
  countItemAntennes: any;

  station_id: number = 0;
  currentStation: any;
  coinwallet: string[] = ['Détail de la station','Antennes', 'Equipements'];
  selectedwallet = this.coinwallet[0];

  constructor(private actRoute: ActivatedRoute, private stationService: StationService, private antennesService: AntennesService){ }


  ngOnInit(): void {
    this.actRoute.paramMap.subscribe(params =>{
      this.station_id = Number(params.get('id'));
    });
    this.findStationId(this.station_id);

    this.sub = this.antennesService.updateRefresh$.subscribe({
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

  openNewAntennaModal(): void
  {

  }

  findStationId(idStation: number){

    this.stationService.findStationId({'station_id': this.station_id}).subscribe({
      next: (response) => {
        console.log(response);
        this.currentStation = response;

        this.loadAntenneStation(response.id);
      },
      error: err => console.log(err),
      complete: () => console.log('complete')
    })
  }

  loadAntenneStation(stationId: number): any{
    this.antennesService.getAntenneCurrentStation(stationId).subscribe({
      next: (response) => {
        console.log(response);
        this.antennes = response.antenna.body;
        this.countItemAntennes = Number(response.antenna.headers[this.headerResponseName][0]);
      },
      error: err => console.log(err),
      complete: () => console.log('complete')
    })
  }

  refesh(): void{
    this.findStationId(this.currentStation.id);
  }

  openNewAntenneModal():void
  {
    $('#newEvent').modal('show');
    this.antennesService.setDataAntenne({'antenne': '', 'type': 'add'});
  }

  update(antenne: any)
  {
    $('#newEvent').modal('show');
    this.antennesService.setDataAntenne({'antenne': antenne, 'type': 'update'});
  }
}
