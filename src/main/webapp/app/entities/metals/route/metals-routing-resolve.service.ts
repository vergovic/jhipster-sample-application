import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMetals } from '../metals.model';
import { MetalsService } from '../service/metals.service';

@Injectable({ providedIn: 'root' })
export class MetalsRoutingResolveService implements Resolve<IMetals | null> {
  constructor(protected service: MetalsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMetals | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((metals: HttpResponse<IMetals>) => {
          if (metals.body) {
            return of(metals.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
