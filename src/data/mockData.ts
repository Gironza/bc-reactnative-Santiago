import { Instrument } from '../types';

export const MOCK_ITEMS: Instrument[] = [
  {
    id: '1',
    name: 'Guitarra Acústica FG800',
    subtitle: 'Yamaha · Cuerdas',
    price: 1250000,
    imageUri: 'https://picsum.photos/seed/guitarra/300/200',
    inStock: true,
  },
  {
    id: '2',
    name: 'Teclado PSR-E373',
    subtitle: 'Yamaha · Teclados',
    price: 1890000,
    imageUri: 'https://picsum.photos/seed/teclado/300/200',
    inStock: true,
  },
  {
    id: '3',
    name: 'Batería Pearl Roadshow',
    subtitle: 'Pearl · Percusión',
    price: 3200000,
    imageUri: 'https://picsum.photos/seed/bateria/300/200',
    inStock: false,
  },
  {
    id: '4',
    name: 'Violín 4/4 Stentor',
    subtitle: 'Stentor · Cuerdas',
    price: 980000,
    imageUri: 'https://picsum.photos/seed/violin/300/200',
    inStock: true,
  },
];