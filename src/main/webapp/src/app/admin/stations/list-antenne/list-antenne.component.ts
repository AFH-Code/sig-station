import { Component, OnDestroy, OnInit } from '@angular/core';
import { AntennesService } from 'src/app/services/stations/antennes.service';
import { StationService } from 'src/app/services/stations/station.service';
import { FormGroup, FormBuilder, Validators, FormArray, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommunService } from 'src/app/services/commun.service';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-list-antenne',
  templateUrl: './list-antenne.component.html',
  styleUrls: ['./list-antenne.component.scss']
})
export class ListAntenneComponent implements OnInit, OnDestroy{

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
  
  antennes: any=[];
  headerResponseName = 'X-Total-Count'; 
  keywordSearch: string = '';
  currentPage: number = 0;
  itemsPerPage: number = 10;
  countItemAntennes: any;
  currentId:number = 0;
  deleteCollection = { action: '', message: 'Supprimer cette ligne ?', id: 'sppmodal-container-confirm' };
  antenneForm: FormGroup = this.formBuilder.group({
    keyword: ['', Validators.required]
  });
  form: any = {};
  isLoadingAntenne=false;

  constructor(private stationService: StationService, private antennesService: AntennesService, private formBuilder: FormBuilder, private communService: CommunService) {}

  ngOnInit(): void {
    this.loadAntennesStation();

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

  onFilter(type: string, value?: any): void {
    if (type === 'PAGE') {
      this.config.currentPage = value;
      this.req.page = value;
      console.log(this.req.page)
      this.loadAntennesStation();
    }
  }

  loadAntennesStation(): any{
      this.antennesService.getAntenneStation(this.req.page -1,this.req.tail, this.keywordSearch).subscribe({
        next: (response) => {
          console.log(response);
          this.antennes = response.antenna.body;
          this.countItemAntennes = Number(response.antenna.headers[this.headerResponseName][0]);
          this.config.totalItems = this.countItemAntennes;
          this.isLoadingAntenne = true;
        },
        error: err => console.log(err),
        complete: () => console.log('complete')
      })
  }

  openNewAntenneModal():void
  {
    $('#newEvent').modal('show');
    this.antennesService.setDataAntenne({'antenne': '', 'type': 'add'});
  }

  onSubmit(form: NgForm): void {
    console.log(this.form);
    this.config.currentPage = 1;
    this.req.page = 1;
    this.keywordSearch = this.form.keyword;
    this.loadAntennesStation();
  }

  refesh(): void{
    this.loadAntennesStation();
  }

  update(antenne: any): void {
    $('#newEvent').modal('show');
    this.antennesService.setDataAntenne({'antenne': antenne, 'type': 'update'});
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
}
