import axios, { isAxiosError } from 'axios';

// La URL base vive en .env.local (EXPO_PUBLIC_API_URL). Nunca se hardcodea aquí.
// Formato: https://<id>.mockapi.io/api/v1
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

if (__DEV__ && (API_BASE_URL === '' || API_BASE_URL.includes('PEGA-AQUI'))) {
  console.warn(
    '[API] Falta configurar EXPO_PUBLIC_API_URL en .env.local (ver .env.example).',
  );
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor de respuesta: log en desarrollo y se rechaza siempre
// para que TanStack Query capture el error.
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (__DEV__ && isAxiosError(error)) {
      console.error('[API Error]', error.response?.status ?? 'sin respuesta', error.config?.url);
    }
    return Promise.reject(error);
  },
);

// Convierte cualquier error en un mensaje legible para la UI.
export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return 'El servidor tardó demasiado en responder.';
    }
    if (!error.response) {
      return 'No hay conexión con el servidor. Revisa tu internet y la URL de la API.';
    }
    if (error.response.status === 404) {
      return 'No se encontró el recurso solicitado.';
    }
    if (error.response.status >= 500) {
      return 'El servidor tuvo un problema. Intenta de nuevo en un momento.';
    }
    return `Error ${error.response.status} al comunicarse con el servidor.`;
  }
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
}