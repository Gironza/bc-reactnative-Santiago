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

// Para el PUT: el id va en la URL y los campos editables en el cuerpo
export interface UpdateInstrumentVariables {
  id: string;
  data: CreateInstrumentPayload;
}

// De dónde vienen los datos de la lista: red o caché local (offline)
export type DataSource = 'network' | 'cache';

export interface InstrumentsWithSource {
  items: Instrument[];
  source: DataSource;
}