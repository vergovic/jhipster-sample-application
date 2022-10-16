import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMetals } from '../metals.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../metals.test-samples';

import { MetalsService } from './metals.service';

const requireRestSample: IMetals = {
  ...sampleWithRequiredData,
};

describe('Metals Service', () => {
  let service: MetalsService;
  let httpMock: HttpTestingController;
  let expectedResult: IMetals | IMetals[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MetalsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Metals', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const metals = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(metals).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Metals', () => {
      const metals = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(metals).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Metals', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Metals', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Metals', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMetalsToCollectionIfMissing', () => {
      it('should add a Metals to an empty array', () => {
        const metals: IMetals = sampleWithRequiredData;
        expectedResult = service.addMetalsToCollectionIfMissing([], metals);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(metals);
      });

      it('should not add a Metals to an array that contains it', () => {
        const metals: IMetals = sampleWithRequiredData;
        const metalsCollection: IMetals[] = [
          {
            ...metals,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMetalsToCollectionIfMissing(metalsCollection, metals);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Metals to an array that doesn't contain it", () => {
        const metals: IMetals = sampleWithRequiredData;
        const metalsCollection: IMetals[] = [sampleWithPartialData];
        expectedResult = service.addMetalsToCollectionIfMissing(metalsCollection, metals);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(metals);
      });

      it('should add only unique Metals to an array', () => {
        const metalsArray: IMetals[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const metalsCollection: IMetals[] = [sampleWithRequiredData];
        expectedResult = service.addMetalsToCollectionIfMissing(metalsCollection, ...metalsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const metals: IMetals = sampleWithRequiredData;
        const metals2: IMetals = sampleWithPartialData;
        expectedResult = service.addMetalsToCollectionIfMissing([], metals, metals2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(metals);
        expect(expectedResult).toContain(metals2);
      });

      it('should accept null and undefined values', () => {
        const metals: IMetals = sampleWithRequiredData;
        expectedResult = service.addMetalsToCollectionIfMissing([], null, metals, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(metals);
      });

      it('should return initial array if no Metals is added', () => {
        const metalsCollection: IMetals[] = [sampleWithRequiredData];
        expectedResult = service.addMetalsToCollectionIfMissing(metalsCollection, undefined, null);
        expect(expectedResult).toEqual(metalsCollection);
      });
    });

    describe('compareMetals', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMetals(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMetals(entity1, entity2);
        const compareResult2 = service.compareMetals(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMetals(entity1, entity2);
        const compareResult2 = service.compareMetals(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMetals(entity1, entity2);
        const compareResult2 = service.compareMetals(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
