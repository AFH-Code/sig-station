import { Component, OnInit, Input} from '@angular/core';
import { Departement } from '../../../model/localite/Departement.model';
import { ArrondissementService } from '../../../services/localite/arrondissement.service';
import { StationService } from 'src/app/services/stations/station.service';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-departement',
  templateUrl: './departement.component.html',
  styleUrls: ['./departement.component.scss']
})
export class DepartementComponent implements OnInit {

  @Input() departement!: Departement;
  arrondissements: any = [];
  isLoadingDepartement=false;

  constructor(private arrondissementService: ArrondissementService, private stationService: StationService) { }

  ngOnInit(): void {
  }

  openSecondPanel(dataObject: any, type: string = 'departement'){
    //$('#station_list').toggleClass('active');
    if(type == 'departement'){
      this.stationService.setData({'type_localite': 'geoJsonDepartement', 'dataObject': dataObject});
    }else if(type == 'arrondissement')
    {
      this.stationService.setData({'type_localite': 'geoJsonArrodissement', 'dataObject': dataObject});
    }
  }

  loadArrodissementPanel(){
    this.arrondissementService.getArrondissementDepart(this.departement.id)
      .subscribe({
        next: (response: any)=>{
          this.arrondissements = response;
          this.isLoadingDepartement = true;
          console.log(response);
        },
        error: (error: any) => {
          console.log(error);
        }
      });
  }
}
