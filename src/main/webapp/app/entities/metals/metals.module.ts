import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MetalsComponent } from './list/metals.component';
import { MetalsDetailComponent } from './detail/metals-detail.component';
import { MetalsUpdateComponent } from './update/metals-update.component';
import { MetalsDeleteDialogComponent } from './delete/metals-delete-dialog.component';
import { MetalsRoutingModule } from './route/metals-routing.module';

@NgModule({
  imports: [SharedModule, MetalsRoutingModule],
  declarations: [MetalsComponent, MetalsDetailComponent, MetalsUpdateComponent, MetalsDeleteDialogComponent],
})
export class MetalsModule {}
