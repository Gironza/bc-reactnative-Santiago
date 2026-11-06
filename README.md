# 🎸 Casa Musical — Semana 04

App móvil hecha con **React Native + Expo + TypeScript** que muestra el catálogo de una tienda de instrumentos musicales. En esta semana se agregó **estado global con Zustand**: los instrumentos favoritos se guardan en un store compartido entre pestañas, se muestran en un badge en tiempo real y se **persisten entre sesiones** con AsyncStorage.

> Rama: `week-4` · Bootcamp de React Native · Semana 04: Estado global con Zustand

---

## 🧩 Dominio

**Tienda de instrumentos musicales.** Cada elemento del catálogo es un instrumento con estos campos:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `string` | Identificador único |
| `name` | `string` | Nombre del instrumento |
| `description` | `string` | Descripción corta del instrumento |
| `brand` | `string` | Marca |
| `price` | `number` | Precio en COP |
| `category` | `'cuerda' \| 'viento' \| 'percusión' \| 'teclado'` | Categoría |
| `inStock` | `boolean` | Disponibilidad |

El catálogo tiene **12 instrumentos** en `src/data/mockData.ts`, repartidos en las 4 categorías, y 3 de ellos están agotados. Los favoritos ya no son una lista fija: los elige el usuario y viven en el store.

---

## 🗃️ Estado global (Zustand)

El store `useFavoritesStore` (`src/stores/favoritesStore.ts`) guarda únicamente los **ids** de los instrumentos favoritos.

| Elemento | Descripción |
|----------|-------------|
| `ids` | Arreglo de ids de instrumentos guardados |
| `addFavorite(id)` | Agrega un id, sin permitir duplicados |
| `removeFavorite(id)` | Quita un id |
| `clearFavorites()` | Vacía todos los favoritos |

**Persistencia:** el store usa el middleware `persist` con `createJSONStorage(() => AsyncStorage)` y `partialize`, de modo que solo se guarda `ids` y los favoritos sobreviven al cerrar la app.

**Selectores específicos:** ningún componente lee el store completo. Cada uno pide solo lo que necesita:

```ts
// ¿Este instrumento es favorito? (devuelve un booleano, no una función)
const isFavorite = useFavoritesStore((s) => s.ids.includes(id));

// Conteo para el badge del tab
const favoritesCount = useFavoritesStore((s) => s.ids.length);
```

---

## 🧭 Arquitectura de navegación

```
NavigationContainer
└── Tab Navigator (RootNavigator)   ← badge con el conteo de favoritos
    ├── Catálogo → HomeStack (Stack Navigator)
    │   ├── HomeList    → HomeScreen (header, búsqueda y lista)
    │   └── HomeDetail  → DetailScreen ({ id, name })
    └── Favoritos → FavoritesScreen

            useFavoritesStore (Zustand + persist)
            ↑ lee/escribe: ItemCard · DetailScreen · FavoritesScreen · RootNavigator
```

Los tipos están en `src/navigation/types.ts`. El detalle recibe solo `{ id, name }` y el resto de los datos se busca en `ITEMS`.

---

## 📱 Pantallas

<table>
  <tr>
    <td align="center">
      <img src="assets/week-4-1.jpeg" width="200" alt="Pantalla de catálogo" />
      <br /><sub><b>Catálogo</b></sub>
    </td>
    <td align="center">
      <img src="assets/week-4-2.jpeg" width="200" alt="Detalle de un instrumento" />
      <br /><sub><b>Detalle</b></sub>
    </td>
    <td align="center">
      <img src="assets/week-4-3.jpeg" width="200" alt="Pantalla de favoritos" />
      <br /><sub><b>Favoritos</b></sub>
    </td>
  </tr>
</table>

- **Catálogo (`HomeScreen`):** header fijo, búsqueda y lista de tarjetas. Cada tarjeta tiene un corazón para guardar o quitar el instrumento sin salir de la lista.
- **Detalle (`DetailScreen`):** muestra los datos completos del instrumento y un botón **Guardar / Quitar de favoritos** que lee y escribe el store.
- **Favoritos (`FavoritesScreen`):** lista los instrumentos guardados, con corazón para quitar cada uno, botón **Limpiar todo** y mensaje de estado vacío.
- **Badge:** la pestaña Favoritos muestra el número de guardados y se actualiza al instante desde cualquier pantalla.

---

## ✅ Requisitos implementados

- Tab Navigator con las pestañas **Catálogo** y **Favoritos**.
- Stack anidado en Catálogo: lista → detalle con params tipados.
- Store Zustand creado con `create<FavoritesStore>()`, sin `any`, con 3 acciones (`addFavorite`, `removeFavorite`, `clearFavorites`).
- **Badge en el tab** con conteo en tiempo real, sin prop drilling.
- Botón Guardar / Quitar en el detalle conectado al store.
- Selectores específicos en todos los componentes (nunca `useStore()` sin selector).
- Persistencia con `persist` + AsyncStorage + `partialize`.
- TypeScript sin errores de compilación (`pnpm typecheck`).
- Se conserva lo de las semanas anteriores: búsqueda con `useMemo`, `FlatList`, theming y estado vacío.

---

## 🎨 Decisiones de diseño

- **Persistir solo ids:** si cambia un precio o una descripción en `mockData`, los favoritos guardados no quedan con datos viejos, porque los instrumentos se derivan desde `ITEMS`.
- **Params mínimos al detalle:** se pasa `{ id, name }` y el detalle busca el resto en `ITEMS`. Así la navegación queda desacoplada de los datos.
- **Booleano dentro del selector:** se usa `s.ids.includes(id)` en vez de leer una función `isItemSaved` del store. Una función tiene siempre la misma referencia, así que el componente no se re-renderizaría al guardar.
- **Derivar fuera del selector:** en Favoritos se selecciona el arreglo `ids` y se transforma con `useMemo`. Crear arrays nuevos dentro del selector provoca bucles de render en Zustand 5.
- **Corazón en la tarjeta:** guardar un favorito no obliga a abrir el detalle. `ItemCard` lee el store directamente, por lo que no hace falta pasar props extra desde la lista.
- **Versiones exactas:** todas las dependencias están fijadas sin `^` ni `~`, y el archivo `.npmrc` tiene `save-exact=true` para que pnpm no vuelva a agregar comodines.

---

## 🗂️ Estructura

```
src/
├── components/ItemCard.tsx        ← Tarjeta con corazón de favoritos
├── data/mockData.ts               ← 12 instrumentos
├── navigation/
│   ├── RootNavigator.tsx          ← Tabs + Stack anidado + badge
│   └── types.ts                   ← Tipos de los navegadores
├── screens/
│   ├── DetailScreen.tsx           ← Detalle + botón Guardar/Quitar
│   ├── FavoritesScreen.tsx        ← Favoritos desde el store
│   └── HomeScreen.tsx             ← Header, búsqueda y lista
├── stores/favoritesStore.ts       ← Store Zustand con persist
├── theme/index.ts                 ← COLORS, TYPOGRAPHY, SPACING, RADIUS
└── types/index.ts                 ← Item e ItemCategory
```

---

## 🛠️ Tecnologías

Todas con versión exacta, alineadas al **Expo SDK 57**:

- Expo 57.0.4, React Native 0.86.0, React 19.2.3 y TypeScript 6.0.3
- React Navigation 7: `native`, `native-stack` y `bottom-tabs`
- Zustand 5.0.14
- `@react-native-async-storage/async-storage` 2.2.0
- `react-native-screens`, `react-native-safe-area-context` y `@expo/vector-icons`
- pnpm como gestor de paquetes

---

## 🚀 Cómo ejecutar

```bash
pnpm install
pnpm start
```

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
