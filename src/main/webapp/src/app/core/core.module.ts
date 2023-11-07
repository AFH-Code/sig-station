import { NgModule , Optional, SkipSelf} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicModule } from '../public/public.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { AdminModule } from '../admin/admin.module';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PublicModule,
    DashboardModule,
    AdminModule,
    ToastrModule.forRoot()
  ]
})
export class CoreModule { 
  constructor(@Optional() @SkipSelf() parentModule: CoreModule){
    if(parentModule){
      throw new Error('CoreModule is already loaded.');
    }
  }
}
