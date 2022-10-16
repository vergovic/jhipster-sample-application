export interface IMetals {
  id: number;
  elementCode?: string | null;
  elementDescription?: string | null;
}

export type NewMetals = Omit<IMetals, 'id'> & { id: null };
