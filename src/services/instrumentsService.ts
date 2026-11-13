import { apiClient } from './api';
import type { CreateInstrumentPayload, Instrument } from '../types';

// Funciones puras que hablan con la API. No conocen React ni TanStack Query.

export async function fetchInstruments(): Promise<Instrument[]> {
  const response = await apiClient.get<Instrument[]>('/instruments');
  return response.data;
}

export async function fetchInstrumentById(id: string): Promise<Instrument> {
  const response = await apiClient.get<Instrument>(`/instruments/${id}`);
  return response.data;
}

export async function createInstrument(
  payload: CreateInstrumentPayload,
): Promise<Instrument> {
  const response = await apiClient.post<Instrument>('/instruments', payload);
  return response.data;
}