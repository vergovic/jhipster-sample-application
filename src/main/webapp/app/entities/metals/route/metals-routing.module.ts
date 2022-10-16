import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MetalsComponent } from '../list/metals.component';
import { MetalsDetailComponent } from '../detail/metals-detail.component';
import { MetalsUpdateComponent } from '../update/metals-update.component';
import { MetalsRoutingResolveService } from './metals-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const metalsRoute: Routes = [
  {
    path: '',
    component: MetalsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MetalsDetailComponent,
    resolve: {
      metals: MetalsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MetalsUpdateComponent,
    resolve: {
      metals: MetalsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MetalsUpdateComponent,
    resolve: {
      metals: MetalsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(metalsRoute)],
  exports: [RouterModule],
})
export class MetalsRoutingModule {}
