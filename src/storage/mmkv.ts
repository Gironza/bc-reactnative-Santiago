// src/storage/mmkv.ts
// Instancia única de MMKV para toda la app.
// Se importa `storage` desde hooks y pantallas; nunca se crea otra.
// ⚠️ Requiere dev build: no funciona en Expo Go.

import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({ id: 'casa-musical-storage' });