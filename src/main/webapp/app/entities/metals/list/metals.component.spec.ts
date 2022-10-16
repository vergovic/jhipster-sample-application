import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MetalsService } from '../service/metals.service';

import { MetalsComponent } from './metals.component';

describe('Metals Management Component', () => {
  let comp: MetalsComponent;
  let fixture: ComponentFixture<MetalsComponent>;
  let service: MetalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'metals', component: MetalsComponent }]), HttpClientTestingModule],
      declarations: [MetalsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(MetalsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MetalsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MetalsService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.metals?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to metalsService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMetalsIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMetalsIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
