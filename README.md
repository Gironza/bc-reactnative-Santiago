# 🎸 Casa Musical — Semana 06

App móvil hecha con **React Native + Expo + TypeScript** que muestra el catálogo de una tienda de instrumentos musicales. En esta semana se agregan **formularios de creación y edición** con **React Hook Form** y **Zod**: validación tipada con mensajes en español, errores inline bajo cada campo, formulario de edición cargado desde la API y un componente `FormField` reutilizable.

> Rama: `week-6` · Bootcamp de React Native · Semana 06: Formularios con React Hook Form + Zod

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

3. Inicia la app limpiando la caché para que Expo lea la variable de entorno:

   ```bash
   pnpm start -c
   ```

---

## 📝 Formularios (React Hook Form + Zod)

Crear y editar un instrumento comparten los mismos campos (`InstrumentFormFields`), el mismo schema y el componente `FormField`.

### Validaciones (`src/schemas/instrumentSchema.ts`)

| Campo | Regla |
|-------|-------|
| `name` | Obligatorio, máx. 80 caracteres (se recorta con `trim`) |
| `brand` | Obligatoria, máx. 40 caracteres |
| `price` | Número entero mayor a 0 (`z.coerce.number()`, el `TextInput` entrega texto) |
| `category` | `cuerda`, `viento`, `percusión` o `teclado` |
| `inStock` | Booleano (Switch) |
| `description` | Opcional, máx. 500 caracteres |

### Cómo está armado

- **`FormField`:** encapsula `Controller` + `TextInput` + mensaje de error. Se reutiliza en todos los campos de texto de Crear y Editar.
- **`InstrumentFormFields`:** agrupa los seis campos (incluye los chips de categoría y el Switch de stock, conectados con `Controller`). Lo usan `CreateScreen` y `EditScreen`.
- **`zodResolver`:** conecta el schema con `useForm`; los errores llegan a `formState.errors` con el mensaje definido en Zod.
- **Tipos sin `any`:** con `z.coerce` el valor de entrada (`price` como texto) y el de salida (`price` como número) son tipos distintos. Por eso se usa `useForm<InstrumentFormInput, unknown, InstrumentFormData>` y `FormField` tipa `control` con los tres genéricos de `Control`.
- **Edición:** el formulario se rellena con `reset()` dentro de un `useEffect`. Se ignora `placeholderData` (la copia provisional de la caché de la lista) y se usa `keepDirtyValues` para que un refetch no pise lo que el usuario ya escribió.
- **Guardar sin cambios:** el botón queda deshabilitado mientras el formulario no esté modificado (`isDirty`).

---

## 🔌 Red y caché (Axios + TanStack Query)

```
src/
├── services/
│   ├── api.ts                  ← Instancia de Axios (baseURL desde .env, timeout, interceptor)
│   └── instrumentsService.ts   ← Funciones puras: fetchInstruments, fetchInstrumentById, createInstrument, updateInstrument
└── hooks/
    └── useInstruments.ts       ← useInstruments · useInstrument · useCreateInstrument · useUpdateInstrument
```

- **Capas separadas:** el servicio habla con la API, el hook envuelve `useQuery`/`useMutation` y las pantallas solo renderizan.
- **`queryKey` centralizada:** `INSTRUMENTS_QUERY_KEY = ['instruments']`, y el detalle usa `['instruments', id]`, de modo que invalidar la lista también refresca los detalles.
- **`QueryClientProvider` en la raíz:** está en `App.tsx`, por fuera del `NavigationContainer`, con `staleTime` de 2 minutos y 1 reintento.
- **Mutaciones con invalidación:** `useCreateInstrument` y `useUpdateInstrument` invalidan `['instruments']` en `onSuccess`, por lo que el catálogo y el detalle se actualizan solos.
- **Errores legibles:** `getErrorMessage` traduce los errores de Axios (sin conexión, timeout, 404, 5xx) a mensajes para el usuario.

### Estado del servidor vs estado de UI

| Tipo de estado | Dónde vive |
|----------------|------------|
| Instrumentos (datos de la API) | **TanStack Query** |
| Ids de favoritos (preferencia del usuario) | **Zustand** (`favoritesStore`, persistido con AsyncStorage) |
| Valores y errores de los formularios | **React Hook Form** |

Zustand guarda solo los **ids**; los datos del instrumento se resuelven desde la caché de la query. No se copia ningún dato de la API dentro del store.

---

## 🧭 Arquitectura de navegación

```
NavigationContainer
└── Tab Navigator (RootNavigator)   ← badge con el conteo de favoritos
    ├── Catálogo → HomeStack (Stack Navigator)
    │   ├── HomeList    → HomeScreen (header, búsqueda y lista)
    │   ├── HomeDetail  → DetailScreen ({ id, name })
    │   ├── HomeCreate  → CreateScreen (formulario)
    │   └── HomeEdit    → EditScreen ({ id, name })
    └── Favoritos → FavoritesScreen
```

---

## 📱 Pantallas

<table>
  <tr>
    <td align="center">
      <img src="assets/week-6-detalle.jpg" width="200" alt="Detalle con botón Editar" />
      <br /><sub><b>Detalle</b></sub>
    </td>
    <td align="center">
      <img src="assets/week-6-create-errores.jpg" width="200" alt="Crear con errores de validación" />
      <br /><sub><b>Crear con errores</b></sub>
    </td>
    <td align="center">
      <img src="assets/week-6-edit.jpg" width="200" alt="Editar un instrumento" />
      <br /><sub><b>Editar</b></sub>
    </td>
  </tr>
</table>

- **Catálogo (`HomeScreen`):** header fijo con botón **+**, búsqueda y lista cargada con `useQuery`. Muestra spinner en la primera carga, un error con botón **Reintentar**, un estado vacío (con y sin búsqueda) y **pull-to-refresh** con `refetch`.
- **Detalle (`DetailScreen`):** recibe solo `{ id, name }` y pide el instrumento con `useInstrument`. Abre al instante con los datos que ya están en la caché de la lista, maneja carga y error con **Reintentar** y tiene el botón **Editar instrumento**.
- **Crear (`CreateScreen`):** formulario con `useForm` + `zodResolver`. Los errores aparecen bajo cada campo al presionar *Crear*, se deshabilitan los campos y el botón mientras se envía, se muestra el error si el POST falla y vuelve al catálogo al terminar.
- **Editar (`EditScreen`):** mismo formulario, con los datos actuales cargados desde la API mediante `reset()`. Guarda con `PUT`, deshabilita *Guardar cambios* mientras no haya modificaciones y vuelve al detalle al terminar.
- **Favoritos (`FavoritesScreen`):** cruza los ids del store con la lista de la API. Espera la carga solo si hay ids guardados e ignora los que ya no existen en la API.

---

## ✅ Requisitos implementados

- Instancia de Axios centralizada con `baseURL` desde variable de entorno (`EXPO_PUBLIC_API_URL`), `timeout` e interceptor de respuesta.
- `useQuery` para la lista y para el detalle, con `queryKey` descriptiva en forma de array.
- `useMutation` para crear y para editar, con `invalidateQueries` en `onSuccess`.
- Estados de **carga**, **error** (con reintento) y **vacío** en la lista.
- **Pull-to-refresh** con `onRefresh` + `refreshing={isFetching}`.
- **`FormField` genérico** reutilizado en Crear y Editar.
- **Validación con Zod** (`zodResolver`) y mensajes de error en español bajo cada campo.
- **Formulario de edición** con `reset()` en `useEffect` al llegar los datos del servidor.
- **Estado de carga** en los formularios: botón deshabilitado y spinner mientras se envía.
- Navegación lista → detalle → edición con params tipados, y pantalla de creación.
- Respuestas y formularios tipados (`z.infer`/`z.input`/`z.output`, genéricos de Axios), sin `as any`.
- Sin estado de servidor en Zustand: el store solo guarda ids de favoritos.
- TypeScript sin errores de compilación (`pnpm typecheck`).

---

## 🎨 Decisiones de diseño

- **Servicio + hook + pantalla:** cada capa tiene una sola responsabilidad. Las funciones del servicio no conocen React y los componentes no llaman a Axios directamente.
- **Un solo formulario para Crear y Editar:** `InstrumentFormFields` evita duplicar los campos y garantiza que ambas pantallas validen igual.
- **`z.coerce` con tres genéricos:** el `TextInput` entrega texto, así que el precio se convierte a número en Zod. Tipar el formulario con entrada y salida separadas evita recurrir a `any`.
- **`reset` con `keepDirtyValues`:** si llegan datos nuevos del servidor mientras el usuario edita, no se pierden sus cambios.
- **`placeholderData` en el detalle:** si el usuario llega desde la lista, el detalle muestra al instante lo que ya está en caché mientras se confirma con el servidor.
- **Error con datos en caché:** si falla un refetch pero ya hay datos, se conserva la lista y se muestra un aviso, en lugar de reemplazarla por una pantalla de error.
- **Búsqueda en el cliente:** el catálogo es pequeño, así que se filtra con `useMemo` sobre los datos de la query, sin una petición por cada letra.
- **Validación al enviar:** los errores del formulario aparecen al presionar *Crear* o *Guardar*, no mientras el usuario todavía está escribiendo; después se revalidan al editar el campo.
- **URL fuera del código:** la URL de la API vive en `.env.local`, ignorado por git. `.env.example` documenta el formato.
- **Se elimina `mockData.ts`:** los datos iniciales pasan a `scripts/instruments.seed.json`, que solo sirve para poblar la API.

---

## 🗂️ Estructura

```
src/
├── components/
│   ├── FormField.tsx              ← Controller + TextInput + error (genérico)
│   ├── InstrumentFormFields.tsx   ← Campos compartidos de Crear y Editar
│   └── ItemCard.tsx               ← Tarjeta con corazón de favoritos
├── hooks/useInstruments.ts        ← Hooks de TanStack Query
├── navigation/
│   ├── RootNavigator.tsx          ← Tabs + Stack anidado + badge
│   └── types.ts                   ← Tipos de los navegadores
├── schemas/instrumentSchema.ts    ← Schema Zod y tipos del formulario
├── screens/
│   ├── CreateScreen.tsx           ← useForm + zodResolver + useMutation
│   ├── DetailScreen.tsx           ← Detalle con useInstrument y botón Editar
│   ├── EditScreen.tsx             ← Edición con reset() + useUpdateInstrument
│   ├── FavoritesScreen.tsx        ← Favoritos (ids del store + datos de la API)
│   └── HomeScreen.tsx             ← Header, búsqueda y lista con useInstruments
├── services/
│   ├── api.ts                     ← Instancia de Axios y getErrorMessage
│   └── instrumentsService.ts      ← Llamadas a la API
├── stores/favoritesStore.ts       ← Store Zustand con persist
├── theme/index.ts                 ← COLORS, TYPOGRAPHY, SPACING, RADIUS
└── types/index.ts                 ← Instrument, InstrumentCategory, payloads
scripts/
├── seed.mjs                       ← Sube los instrumentos iniciales a la API
└── instruments.seed.json          ← Los 12 instrumentos
```

---

## 🛠️ Tecnologías

Alineadas al **Expo SDK 57**. El archivo `.npmrc` tiene `save-exact=true` para que pnpm fije las versiones al instalar; `expo`, `expo-status-bar` y `react-native-screens` conservan `~` porque así los deja `expo install`.

- Expo ~57.0.32, React Native 0.86.3, React 19.2.3 y TypeScript 6.0.3
- **React Hook Form** 7.81.0, **Zod** 4.4.3 y **@hookform/resolvers** 5.4.0
- **Axios** 1.18.1
- **TanStack Query** 5.101.2
- React Navigation 7: `native`, `native-stack` y `bottom-tabs`
- Zustand 5.0.14
- `@react-native-async-storage/async-storage` 2.2.0
- `react-native-screens`, `react-native-safe-area-context` y `@expo/vector-icons`
- pnpm como gestor de paquetes

---

## 🚀 Cómo ejecutar

```bash
pnpm install
cp .env.example .env.local   # luego edita .env.local con la URL de tu API
node scripts/seed.mjs        # solo la primera vez
pnpm start -c
```

En Windows, en lugar de `cp` puedes usar `copy .env.example .env.local`.

Luego escanea el QR con **Expo Go (SDK 57)**, o presiona `a` (Android) / `i` (iOS).

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