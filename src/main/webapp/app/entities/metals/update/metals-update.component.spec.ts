import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MetalsFormService } from './metals-form.service';
import { MetalsService } from '../service/metals.service';
import { IMetals } from '../metals.model';

import { MetalsUpdateComponent } from './metals-update.component';

describe('Metals Management Update Component', () => {
  let comp: MetalsUpdateComponent;
  let fixture: ComponentFixture<MetalsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let metalsFormService: MetalsFormService;
  let metalsService: MetalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MetalsUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(MetalsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MetalsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    metalsFormService = TestBed.inject(MetalsFormService);
    metalsService = TestBed.inject(MetalsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const metals: IMetals = { id: 456 };

      activatedRoute.data = of({ metals });
      comp.ngOnInit();

      expect(comp.metals).toEqual(metals);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMetals>>();
      const metals = { id: 123 };
      jest.spyOn(metalsFormService, 'getMetals').mockReturnValue(metals);
      jest.spyOn(metalsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ metals });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: metals }));
      saveSubject.complete();

      // THEN
      expect(metalsFormService.getMetals).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(metalsService.update).toHaveBeenCalledWith(expect.objectContaining(metals));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMetals>>();
      const metals = { id: 123 };
      jest.spyOn(metalsFormService, 'getMetals').mockReturnValue({ id: null });
      jest.spyOn(metalsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ metals: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: metals }));
      saveSubject.complete();

      // THEN
      expect(metalsFormService.getMetals).toHaveBeenCalled();
      expect(metalsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMetals>>();
      const metals = { id: 123 };
      jest.spyOn(metalsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ metals });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(metalsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
