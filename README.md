# 🎸 Casa Musical — Semana 07

App móvil hecha con **React Native + Expo + TypeScript** que muestra el catálogo de una tienda de instrumentos musicales. En esta semana se agrega una **capa de persistencia local** con tres almacenes, cada uno para lo que mejor hace: **MMKV** para las preferencias del usuario, **AsyncStorage** para la caché offline del catálogo y **Expo SecureStore** para un dato sensible cifrado.

> Rama: `week-7` · Bootcamp de React Native · Semana 07: Persistencia Local

---

## 🧩 Dominio

**Tienda de instrumentos musicales.** Cada elemento del catálogo es un instrumento con estos campos:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `string` | Identificador único (lo asigna el servidor) |
| `name` | `string` | Nombre del instrumento |
| `description` | `string` | Descripción corta del instrumento |
| `brand` | `string` | Marca |
| `price` | `number` | Precio en COP |
| `category` | `'cuerda' \| 'viento' \| 'percusión' \| 'teclado'` | Categoría |
| `inStock` | `boolean` | Disponibilidad |

---

## 💾 Persistencia local

| Almacén | Qué guarda en esta app | Por qué este almacén |
|---------|------------------------|----------------------|
| **MMKV** | Preferencias: orden del catálogo, modo compacto e ítems por página | Valores pequeños y frecuentes; lectura y escritura **sincrónicas**, sin `await` |
| **AsyncStorage** | Caché de la lista de instrumentos | Datos más grandes (una lista serializada) que deben sobrevivir sin red |
| **SecureStore** | PIN de caja de la tienda | Dato sensible: se cifra con el Keystore (Android) o el Keychain (iOS) |

Los favoritos (semana 4) siguen persistidos con Zustand + AsyncStorage; esta semana no se tocan.

### 1. Preferencias con MMKV

```
src/
├── storage/mmkv.ts            ← Instancia global: createMMKV({ id: 'casa-musical-storage' })
└── hooks/usePreferences.ts    ← useMMKVString / useMMKVBoolean / useMMKVNumber
```

| Preferencia | Clave MMKV | Valores | Valor por defecto | Efecto en la app |
|-------------|------------|---------|-------------------|------------------|
| `sortOrder` | `pref_sortOrder` | `'asc'` · `'desc'` | `'asc'` | Ordena el catálogo por nombre (A→Z / Z→A) |
| `compactMode` | `pref_compactMode` | `true` · `false` | `false` | La tarjeta oculta la marca |
| `itemsPerPage` | `pref_itemsPerPage` | `5` · `10` · `20` | `10` | Se guarda y se edita en Ajustes |

- **Una sola instancia:** `storage` se crea a nivel de módulo y todos los hooks la importan.
- **Hooks reactivos:** al cambiar una preferencia en Ajustes, el Catálogo se vuelve a renderizar solo; no hay botón "Guardar".
- **Claves como constantes:** `PREF_KEYS` evita strings sueltos y errores de tipeo.
- **Valores por defecto:** MMKV devuelve `undefined` la primera vez, así que `usePreferences` entrega siempre un valor válido.
- **react-native-mmkv 4.x:** la instancia se crea con `createMMKV(...)` (en la 3.x era `new MMKV(...)`) y usa `react-native-nitro-modules`.

### 2. Caché offline con AsyncStorage

La lógica vive en `useInstruments` (`src/hooks/useInstruments.ts`):

```
fetchInstrumentsWithCache()
├── Con red  → GET /instruments → guarda la lista en '@instruments_cache' → { items, source: 'network' }
└── Sin red  → lee '@instruments_cache'                                   → { items, source: 'cache' }
                └── si tampoco hay caché → propaga el error (pantalla de error con Reintentar)
```

- **`source`:** el hook devuelve los instrumentos junto con su origen (`'network'` o `'cache'`), definido en `InstrumentsWithSource` (`src/types/index.ts`).
- **Banner offline:** cuando `source === 'cache'`, el Catálogo muestra "⚠️ Mostrando datos sin red".
- **Sin cambios para el resto:** `useInstrument` (detalle) y `FavoritesScreen` leen `data.items`; las mutaciones siguen invalidando `['instruments']`.

### 3. Dato sensible con SecureStore

En **Ajustes → Seguridad** se guarda un **PIN de caja** de demostración con la clave `sec_cashier_pin`.

- **Guardar:** `SecureStore.setItemAsync`.
- **Leer:** `SecureStore.getItemAsync`; solo confirma que existe (`PIN leído correctamente (4 dígitos)`).
- **Eliminar:** `SecureStore.deleteItemAsync`.
- **Nunca en pantalla:** el valor del PIN no se muestra ni se registra en logs; la interfaz solo muestra mensajes de confirmación.
- **Al abrir Ajustes:** se consulta si ya hay un PIN guardado para mostrar el estado correcto.

---

## 🌐 API

El catálogo vive en un recurso `instruments` creado en **[MockAPI](https://mockapi.io/)**, con los mismos 12 instrumentos que tenía la app (`scripts/instruments.seed.json`).

| Método | Endpoint | Uso en la app |
|--------|----------|---------------|
| `GET` | `/instruments` | Lista del catálogo y de favoritos (`useInstruments`) |
| `GET` | `/instruments/:id` | Detalle y carga del formulario de edición (`useInstrument`) |
| `POST` | `/instruments` | Crear un instrumento (`useCreateInstrument`) |
| `PUT` | `/instruments/:id` | Editar un instrumento (`useUpdateInstrument`) |

### Configuración

1. Copia `.env.example` como `.env.local` y pega la URL base de tu proyecto en MockAPI:

   ```bash
   EXPO_PUBLIC_API_URL=https://<id-del-proyecto>.mockapi.io
   ```

   `.env.local` está en `.gitignore`: la URL no se sube al repositorio.

2. Carga los 12 instrumentos iniciales (solo la primera vez, necesita Node 18+):

   ```bash
   node scripts/seed.mjs
   ```

---

## 📝 Formularios (React Hook Form + Zod)

Crear y editar un instrumento comparten los mismos campos (`InstrumentFormFields`), el mismo schema (`src/schemas/instrumentSchema.ts`) y el componente `FormField`. La validación se hace con `zodResolver`, con mensajes en español bajo cada campo, y el formulario de edición se rellena con `reset()` al llegar los datos del servidor. *(Sin cambios en esta semana.)*

---

## 🔌 Red y caché (Axios + TanStack Query)

- **Capas separadas:** `instrumentsService.ts` habla con la API, `useInstruments.ts` envuelve `useQuery`/`useMutation` y las pantallas solo renderizan.
- **`queryKey` centralizada:** `INSTRUMENTS_QUERY_KEY = ['instruments']`; el detalle usa `['instruments', id]`, así que invalidar la lista también refresca los detalles.
- **`QueryClientProvider` en la raíz** (`App.tsx`), con `staleTime` de 2 minutos y 1 reintento.
- **Errores legibles:** `getErrorMessage` traduce los errores de Axios a mensajes para el usuario.

### Estado del servidor vs estado de UI vs persistencia

| Tipo de dato | Dónde vive |
|--------------|------------|
| Instrumentos (datos de la API) | **TanStack Query** + copia en **AsyncStorage** (caché offline) |
| Ids de favoritos | **Zustand** (`favoritesStore`, persistido con AsyncStorage) |
| Preferencias del usuario | **MMKV** (`usePreferences`) |
| PIN de caja | **SecureStore** |
| Valores y errores de los formularios | **React Hook Form** |

---

## 🧭 Arquitectura de navegación

```
NavigationContainer
└── Tab Navigator (RootNavigator)   ← badge con el conteo de favoritos
    ├── Catálogo → HomeStack (Stack Navigator)
    │   ├── HomeList    → HomeScreen (header, búsqueda, lista y banner offline)
    │   ├── HomeDetail  → DetailScreen ({ id, name })
    │   ├── HomeCreate  → CreateScreen (formulario)
    │   └── HomeEdit    → EditScreen ({ id, name })
    ├── Favoritos → FavoritesScreen
    └── Ajustes → SettingsScreen (preferencias MMKV + PIN en SecureStore)
```

---

## 📱 Pantallas

<table>
  <tr>
    <td align="center">
      <img src="assets/week-7-ajustes.jpg" width="200" alt="Pantalla de ajustes" />
      <br /><sub><b>Ajustes</b></sub>
    </td>
    <td align="center">
      <img src="assets/week-7-compacto.jpg" width="200" alt="Catálogo en modo compacto" />
      <br /><sub><b>Modo compacto</b></sub>
    </td>
    <td align="center">
      <img src="assets/week-7-offline.jpg" width="200" alt="Catálogo con banner sin red" />
      <br /><sub><b>Sin red (caché)</b></sub>
    </td>
  </tr>
</table>

- **Catálogo (`HomeScreen`):** header fijo con botón **+**, búsqueda y lista. Aplica el orden y el modo compacto guardados en MMKV, y muestra el banner "⚠️ Mostrando datos sin red" cuando los datos vienen de la caché. Conserva spinner de carga, error con **Reintentar**, estado vacío y **pull-to-refresh**.
- **Ajustes (`SettingsScreen`):** switch de modo compacto, selector de orden (A→Z / Z→A) y de ítems por página, todos con guardado inmediato. La sección **Seguridad** permite guardar, leer y eliminar el PIN de caja sin mostrarlo.
- **Detalle, Crear, Editar y Favoritos:** igual que en la semana 6.

---

## ✅ Requisitos implementados

- `usePreferences` con 3 preferencias (`sortOrder`, `compactMode`, `itemsPerPage`) usando `useMMKVString`, `useMMKVBoolean` y `useMMKVNumber`; persisten sin `async/await` y sin reiniciar la app.
- Caché offline en `useInstruments`: guarda la lista cuando la red responde y la carga desde AsyncStorage cuando la llamada falla.
- Banner "⚠️ Mostrando datos sin red" en el Catálogo cuando se usa la caché.
- `SettingsScreen` con las tres preferencias en vivo (sin botón "Guardar") y sección "Seguridad" para guardar, leer y eliminar un dato sensible con SecureStore.
- El dato sensible nunca aparece en texto plano en pantalla (solo confirmaciones).
- El Catálogo aplica `sortOrder` y `compactMode`.
- TypeScript sin errores de compilación (`pnpm typecheck`).

---

## 🎨 Decisiones de diseño

- **Cada dato en su almacén:** lo pequeño y frecuente va a MMKV, la lista a AsyncStorage y lo sensible a SecureStore. Nunca se guardan tokens ni PIN en AsyncStorage o MMKV porque no están cifrados.
- **Instancia única de MMKV:** evita varias instancias apuntando a archivos distintos y mantiene las claves en un solo lugar.
- **`source` junto a los datos:** en vez de adivinar si hubo red con `isError`, la query dice de dónde vienen los datos y la interfaz decide qué mostrar.
- **Caché solo como respaldo:** primero se intenta la red; la caché se lee únicamente cuando falla, para no mostrar datos viejos si hay conexión.
- **Cambios mínimos al integrar la caché:** `useInstrument` y `FavoritesScreen` se adaptaron a `data.items`; el resto de la app no cambió.
- **`itemsPerPage`:** se persiste y se edita en Ajustes, pero la lista no lo aplica; el enunciado del proyecto solo exige que el Catálogo aplique `sortOrder` y `compactMode`.
- **PIN de demostración:** el valor es una constante de prueba; el objetivo es mostrar el ciclo guardar/leer/eliminar cifrado, no gestionar credenciales reales.
- **Servicio + hook + pantalla** y **un solo formulario para Crear y Editar**: se mantienen de semanas anteriores.

---

## 🗂️ Estructura

```
src/
├── components/
│   ├── FormField.tsx              ← Controller + TextInput + error (genérico)
│   ├── InstrumentFormFields.tsx   ← Campos compartidos de Crear y Editar
│   └── ItemCard.tsx               ← Tarjeta con corazón de favoritos y modo compacto
├── hooks/
│   ├── useInstruments.ts          ← TanStack Query + caché offline con AsyncStorage
│   └── usePreferences.ts          ← Preferencias persistidas con MMKV
├── navigation/
│   ├── RootNavigator.tsx          ← Tabs (Catálogo, Favoritos, Ajustes) + Stack anidado
│   └── types.ts                   ← Tipos de los navegadores
├── schemas/instrumentSchema.ts    ← Schema Zod y tipos del formulario
├── screens/
│   ├── CreateScreen.tsx
│   ├── DetailScreen.tsx
│   ├── EditScreen.tsx
│   ├── FavoritesScreen.tsx
│   ├── HomeScreen.tsx             ← Lista con orden, modo compacto y banner offline
│   └── SettingsScreen.tsx         ← Preferencias MMKV + PIN en SecureStore
├── services/
│   ├── api.ts                     ← Instancia de Axios y getErrorMessage
│   └── instrumentsService.ts      ← Llamadas a la API
├── storage/mmkv.ts                ← Instancia global de MMKV
├── stores/favoritesStore.ts       ← Store Zustand con persist
├── theme/index.ts                 ← COLORS, TYPOGRAPHY, SPACING, RADIUS
└── types/index.ts                 ← Instrument, payloads e InstrumentsWithSource
scripts/
├── seed.mjs                       ← Sube los instrumentos iniciales a la API
└── instruments.seed.json          ← Los 12 instrumentos
```

---

## 🛠️ Tecnologías

Alineadas al **Expo SDK 57**. El archivo `.npmrc` tiene `save-exact=true` para que pnpm fije las versiones al instalar.

- Expo ~57.0.32, React Native 0.86.3, React 19.2.3 y TypeScript 6.0.3
- **react-native-mmkv** 4.3.2 y **react-native-nitro-modules** 0.36.1
- **expo-secure-store** y **expo-dev-client** (versiones fijadas por `expo install`)
- `@react-native-async-storage/async-storage` 2.2.0
- **React Hook Form** 7.81.0, **Zod** 4.4.3 y **@hookform/resolvers** 5.4.0
- **Axios** 1.18.1 y **TanStack Query** 5.101.2
- React Navigation 7: `native`, `native-stack` y `bottom-tabs`
- Zustand 5.0.14
- pnpm como gestor de paquetes

---

## 🚀 Cómo ejecutar

> ⚠️ **MMKV no funciona en Expo Go.** Esta semana la app necesita un **dev build** (build nativo). Se requiere Android Studio con el SDK de Android 16 (API 36) y JDK 17, y un celular con depuración USB o un emulador.

```bash
pnpm install
cp .env.example .env.local   # luego edita .env.local con la URL de tu API
node scripts/seed.mjs        # solo la primera vez
pnpm expo run:android        # primer build: compila e instala la app de desarrollo
```

En Windows, en lugar de `cp` puedes usar `copy .env.example .env.local`.

Las siguientes veces no hace falta recompilar: abre la app instalada o corre

```bash
pnpm start --dev-client
```

Las carpetas `android/` e `ios/` que genera el build local están en `.gitignore`.

Para verificar los tipos:

```bash
pnpm typecheck
```

---

## 🌿 Ramas

| Rama | Contenido |
|------|-----------|
| `week-1` | App de tarjetas con Core Components y Flexbox |
| `week-2` | Lista con búsqueda, `FlatList` y theming |
| `week-3` | Navegación con Tabs y Stack (React Navigation 7) |
| `week-4` | Estado global con Zustand, badge y persistencia |
| `week-5` | Networking con Axios y TanStack Query v5 |
| `week-6` | Formularios con React Hook Form y Zod (Crear y Editar) |
| `week-7` | Persistencia local: MMKV, AsyncStorage y SecureStore |