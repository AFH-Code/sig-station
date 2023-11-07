import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    NgMultiSelectDropDownModule,
    AutocompleteLibModule,
    InfiniteScrollModule,
    NgxPaginationModule,
    NgSelectModule,
    NgxLoadingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HelperDependenciesModule { }

