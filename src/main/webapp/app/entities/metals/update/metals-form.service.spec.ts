import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../metals.test-samples';

import { MetalsFormService } from './metals-form.service';

describe('Metals Form Service', () => {
  let service: MetalsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetalsFormService);
  });

  describe('Service methods', () => {
    describe('createMetalsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMetalsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            elementCode: expect.any(Object),
            elementDescription: expect.any(Object),
          })
        );
      });

      it('passing IMetals should create a new form with FormGroup', () => {
        const formGroup = service.createMetalsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            elementCode: expect.any(Object),
            elementDescription: expect.any(Object),
          })
        );
      });
    });

    describe('getMetals', () => {
      it('should return NewMetals for default Metals initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMetalsFormGroup(sampleWithNewData);

        const metals = service.getMetals(formGroup) as any;

        expect(metals).toMatchObject(sampleWithNewData);
      });

      it('should return NewMetals for empty Metals initial value', () => {
        const formGroup = service.createMetalsFormGroup();

        const metals = service.getMetals(formGroup) as any;

        expect(metals).toMatchObject({});
      });

      it('should return IMetals', () => {
        const formGroup = service.createMetalsFormGroup(sampleWithRequiredData);

        const metals = service.getMetals(formGroup) as any;

        expect(metals).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMetals should not enable id FormControl', () => {
        const formGroup = service.createMetalsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMetals should disable id FormControl', () => {
        const formGroup = service.createMetalsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
