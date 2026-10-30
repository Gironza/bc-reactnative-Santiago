export type ItemCategory = 'cuerda' | 'viento' | 'percusión' | 'teclado';

export interface Item {
  id: string;
  name: string;
  description: string;
  brand: string;
  price: number;
  category: ItemCategory;
  inStock: boolean;
}
