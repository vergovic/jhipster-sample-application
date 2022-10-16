import { IMetals, NewMetals } from './metals.model';

export const sampleWithRequiredData: IMetals = {
  id: 50718,
};

export const sampleWithPartialData: IMetals = {
  id: 16909,
  elementCode: 'synergies',
  elementDescription: 'Taka',
};

export const sampleWithFullData: IMetals = {
  id: 16657,
  elementCode: 'program innovative',
  elementDescription: 'Berkshire syndicate',
};

export const sampleWithNewData: NewMetals = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
