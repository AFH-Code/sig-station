import { Component, OnInit } from '@angular/core';
import { loadingRoles } from '../../../helpers/appSettings';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.scss']
})
export class HeaderAdminComponent implements OnInit {

  loadingRoles = loadingRoles;
  currentUser: any;
  constructor(private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    this.currentUser = this.tokenStorage.getCurrentUser();
  }

}
