export type InstrumentCategory = 'cuerda' | 'viento' | 'percusión' | 'teclado';

// Modelo del recurso /instruments de la API (MockAPI)
export interface Instrument {
  id: string;
  name: string;
  description: string;
  brand: string;
  price: number;
  category: InstrumentCategory;
  inStock: boolean;
}

// Lo que se envía en el POST: el id lo asigna el servidor
export type CreateInstrumentPayload = Omit<Instrument, 'id'>;