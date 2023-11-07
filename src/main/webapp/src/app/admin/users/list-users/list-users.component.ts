import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/users/user.service';
import { Subscription } from 'rxjs';
import { CommunService } from 'src/app/services/commun.service';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit, OnDestroy{

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
  users: any=[];
  headerResponseName = 'X-Total-Count'; 
  keywordSearch: string = '';
  currentPage: number = 0;
  itemsPerPage: number = 10;
  countItemUser: any = 0;
  deleteCollection = { action: '', message: 'Supprimer cette ligne ?', id: 'sppmodal-container-confirm' };
  userForm: FormGroup = this.formBuilder.group({
    keyword: ['', Validators.required]
  });
  form: any = {};
  isLoadingUsers=false;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private communService: CommunService) { }

  ngOnInit(): void {
    this.loadUsers();

    this.sub = this.userService.updateRefresh$.subscribe({
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

  onSubmit(form: NgForm): void {
    console.log(this.form);
    //this.config.currentPage = 1;
    //this.req.page = 1;
    //this.keywordSearch = this.form.keyword;
    //this.loadStation(false);
  }

  loadUsers(): any{
    this.userService.getAllUsers(this.req.page -1,this.req.tail, this.keywordSearch).subscribe({
      next: (response) => {
        console.log(response);
        this.users = response.user.body;
        this.countItemUser = Number(response.user.headers[this.headerResponseName][0]);
        this.isLoadingUsers = true;
        //this.users = response.content;
        //this.countItemUser = Number(response.numberOfElements);
        this.config.totalItems = this.countItemUser;
      },
      error: err => console.log(err),
      complete: () => console.log('complete')
    })
  }

  onFilter(type: string, value?: any): void {
    if (type === 'PAGE') {
      this.config.currentPage = value;
      this.req.page = value;
      console.log(this.req.page)
      this.loadUsers();
    }
  }

  refesh(): void{
    this.loadUsers();
  }

  update(user: any): void {
    $('#newEvent').modal('show');
    this.userService.setDataUser({'user': user, 'type': 'update'});
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

  openNewUserModal():void
  {
    $('#newEvent').modal('show');
    this.userService.setDataUser({'user': '', 'type': 'add'});
  }
}
