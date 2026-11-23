import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  createInstrument,
  fetchInstrumentById,
  fetchInstruments,
  updateInstrument,
} from '../services/instrumentsService';
import type {
  CreateInstrumentPayload,
  Instrument,
  InstrumentsWithSource,
  UpdateInstrumentVariables,
} from '../types';

// Una sola fuente de la queryKey: evita typos al invalidar.
export const INSTRUMENTS_QUERY_KEY = ['instruments'] as const;

// Clave de AsyncStorage para la caché offline del catálogo
const CACHE_KEY = '@instruments_cache';

// Con red: pide el catálogo y lo guarda en disco.
// Sin red: devuelve lo último guardado. Si tampoco hay caché, propaga el error.
async function fetchInstrumentsWithCache(): Promise<InstrumentsWithSource> {
  try {
    const items = await fetchInstruments();
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(items));
    return { items, source: 'network' };
  } catch (error) {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      return { items: JSON.parse(cached) as Instrument[], source: 'cache' };
    }
    throw error;
  }
}

// Lista completa del catálogo, con caché offline
export function useInstruments() {
  return useQuery<InstrumentsWithSource>({
    queryKey: INSTRUMENTS_QUERY_KEY,
    queryFn: fetchInstrumentsWithCache,
  });
}

// Un instrumento por id. Mientras llega la respuesta, se muestra lo que
// ya hay en la caché de la lista (si existe) para que el detalle abra al instante.
export function useInstrument(id: string) {
  const queryClient = useQueryClient();

  return useQuery<Instrument>({
    queryKey: [...INSTRUMENTS_QUERY_KEY, id],
    queryFn: () => fetchInstrumentById(id),
    placeholderData: () =>
      queryClient
        .getQueryData<InstrumentsWithSource>(INSTRUMENTS_QUERY_KEY)
        ?.items.find((instrument) => instrument.id === id),
  });
}

// Crear un instrumento. Al terminar, invalida la lista para que se refresque sola.
export function useCreateInstrument() {
  const queryClient = useQueryClient();

  return useMutation<Instrument, Error, CreateInstrumentPayload>({
    mutationFn: createInstrument,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: INSTRUMENTS_QUERY_KEY });
    },
  });
}

// Actualizar un instrumento. Invalidar ['instruments'] cubre la lista y también
// el detalle ['instruments', id], porque TanStack Query invalida por prefijo.
export function useUpdateInstrument() {
  const queryClient = useQueryClient();

  return useMutation<Instrument, Error, UpdateInstrumentVariables>({
    mutationFn: updateInstrument,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: INSTRUMENTS_QUERY_KEY });
    },
  });
}