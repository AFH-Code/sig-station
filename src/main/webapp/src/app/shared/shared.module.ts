import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HelperDependenciesModule } from './modules/helper-dependencies.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderAdminComponent } from './components/header-admin/header-admin.component';
import { StationModalComponent } from './components/station-modal/station-modal.component';
import { PaginationComponent } from './components/pagination/pagination.component';

import {
  HighlighterPipe,
} from './pipes/shared-pipe';
import { UserModalComponent } from './components/user-modal/user-modal.component';
import { AntenneModalComponent } from './components/antenne-modal/antenne-modal.component';
import { ModalConfirmComponent } from './components/modal-confirm/modal-confirm.component';
import { OrganisationModalComponent } from './components/organisation-modal/organisation-modal.component';

@NgModule({
  declarations: [
    FooterComponent,
    HeaderAdminComponent,
    StationModalComponent,
    PaginationComponent,
    HighlighterPipe,
    UserModalComponent,
    AntenneModalComponent,
    ModalConfirmComponent,
    OrganisationModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HelperDependenciesModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HelperDependenciesModule,
    FooterComponent,
    PaginationComponent,
    HeaderAdminComponent,
    StationModalComponent,
    HighlighterPipe,
    UserModalComponent,
    AntenneModalComponent,
    ModalConfirmComponent,
    OrganisationModalComponent
  ]
})
export class SharedModule { }
