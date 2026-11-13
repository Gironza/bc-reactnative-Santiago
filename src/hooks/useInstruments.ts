import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createInstrument,
  fetchInstrumentById,
  fetchInstruments,
} from '../services/instrumentsService';
import type { CreateInstrumentPayload, Instrument } from '../types';

// Una sola fuente de la queryKey: evita typos al invalidar.
export const INSTRUMENTS_QUERY_KEY = ['instruments'] as const;

// Lista completa del catálogo
export function useInstruments() {
  return useQuery<Instrument[]>({
    queryKey: INSTRUMENTS_QUERY_KEY,
    queryFn: fetchInstruments,
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
        .getQueryData<Instrument[]>(INSTRUMENTS_QUERY_KEY)
        ?.find((instrument) => instrument.id === id),
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