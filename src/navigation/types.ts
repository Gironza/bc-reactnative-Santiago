import type { ItemCategory } from '../types';

export type RootTabParamList = {
  Home: undefined;
  Favorites: undefined;
};

export type HomeStackParamList = {
  HomeList: undefined;
  HomeDetail: {
    id: string;
    name: string;
    description: string;
    brand: string;
    price: number;
    category: ItemCategory;
    inStock: boolean;
  };
};