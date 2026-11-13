export type RootTabParamList = {
  Home: undefined;
  Favorites: undefined;
};

export type HomeStackParamList = {
  HomeList: undefined;
  // El detalle solo recibe lo mínimo; el resto de los datos viene de la API
  HomeDetail: {
    id: string;
    name: string;
  };
  HomeCreate: undefined;
};