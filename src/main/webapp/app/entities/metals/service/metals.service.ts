import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMetals, NewMetals } from '../metals.model';

export type PartialUpdateMetals = Partial<IMetals> & Pick<IMetals, 'id'>;

export type EntityResponseType = HttpResponse<IMetals>;
export type EntityArrayResponseType = HttpResponse<IMetals[]>;

@Injectable({ providedIn: 'root' })
export class MetalsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/metals');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(metals: NewMetals): Observable<EntityResponseType> {
    return this.http.post<IMetals>(this.resourceUrl, metals, { observe: 'response' });
  }

  update(metals: IMetals): Observable<EntityResponseType> {
    return this.http.put<IMetals>(`${this.resourceUrl}/${this.getMetalsIdentifier(metals)}`, metals, { observe: 'response' });
  }

  partialUpdate(metals: PartialUpdateMetals): Observable<EntityResponseType> {
    return this.http.patch<IMetals>(`${this.resourceUrl}/${this.getMetalsIdentifier(metals)}`, metals, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMetals>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMetals[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMetalsIdentifier(metals: Pick<IMetals, 'id'>): number {
    return metals.id;
  }

  compareMetals(o1: Pick<IMetals, 'id'> | null, o2: Pick<IMetals, 'id'> | null): boolean {
    return o1 && o2 ? this.getMetalsIdentifier(o1) === this.getMetalsIdentifier(o2) : o1 === o2;
  }

  addMetalsToCollectionIfMissing<Type extends Pick<IMetals, 'id'>>(
    metalsCollection: Type[],
    ...metalsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const metals: Type[] = metalsToCheck.filter(isPresent);
    if (metals.length > 0) {
      const metalsCollectionIdentifiers = metalsCollection.map(metalsItem => this.getMetalsIdentifier(metalsItem)!);
      const metalsToAdd = metals.filter(metalsItem => {
        const metalsIdentifier = this.getMetalsIdentifier(metalsItem);
        if (metalsCollectionIdentifiers.includes(metalsIdentifier)) {
          return false;
        }
        metalsCollectionIdentifiers.push(metalsIdentifier);
        return true;
      });
      return [...metalsToAdd, ...metalsCollection];
    }
    return metalsCollection;
  }
}
