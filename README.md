# 🎸 Casa Musical — Semana 03

App móvil hecha con **React Native + Expo + TypeScript** que muestra el catálogo de una tienda de instrumentos musicales. En esta semana se agregó **navegación con React Navigation 7**: pestañas inferiores (Tab Navigator) y, dentro de la pestaña principal, un Stack Navigator con la lista y el detalle de cada instrumento.

> Rama: `week-3` · Bootcamp de React Native · Semana 03: Navegación con React Navigation

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

El catálogo tiene **12 instrumentos** en `src/data/mockData.ts`, repartidos en las 4 categorías, y 3 de ellos están agotados. La pestaña de favoritos usa un subconjunto de 3 instrumentos (`FAVORITES`).

---

## 🧭 Arquitectura de navegación

```
NavigationContainer
└── Tab Navigator (RootNavigator)
    ├── Catálogo → HomeStack (Stack Navigator)
    │   ├── HomeList    → HomeScreen (header, búsqueda y lista)
    │   └── HomeDetail  → DetailScreen (datos del instrumento)
    └── Favoritos → FavoritesScreen
```

Los tipos de cada navegador están en `src/navigation/types.ts` (`RootTabParamList` y `HomeStackParamList`), lo que permite autocompletado y verificación de los parámetros en tiempo de compilación.

---

## 📱 Pantallas

<table>
  <tr>
    <td align="center">
      <img src="assets/week-3-1.jpeg" width="200" alt="Pantalla de catálogo" />
      <br /><sub><b>Catálogo</b></sub>
    </td>
    <td align="center">
      <img src="assets/week-3-2.jpeg" width="200" alt="Pantalla de favoritos" />
      <br /><sub><b>Favoritos</b></sub>
    </td>
    <td align="center">
      <img src="assets/week-3-3.jpeg" width="200" alt="Detalle de un instrumento" />
      <br /><sub><b>Detalle</b></sub>
    </td>
  </tr>
</table>

- **Catálogo (`HomeScreen`):** header fijo "Casa Musical", barra de búsqueda fija y lista de tarjetas que se desplaza. Al tocar una tarjeta se abre el detalle.
- **Búsqueda:** filtra en tiempo real por nombre, marca o categoría, y muestra un mensaje cuando no hay resultados.
- **Detalle (`DetailScreen`):** muestra marca, categoría, precio, disponibilidad y descripción del instrumento. El header del Stack muestra el nombre y el botón para volver.
- **Favoritos (`FavoritesScreen`):** lista de instrumentos favoritos con marca, descripción y precio.

---

## ✅ Requisitos implementados

- `NavigationContainer` envolviendo toda la app, junto con `SafeAreaProvider`.
- Stack Navigator con `createNativeStackNavigator` (lista → detalle).
- Navegación con `navigation.navigate('HomeDetail', params)` desde la lista y regreso con el botón de volver del header.
- Paso de parámetros entre pantallas y lectura con `useRoute` tipado.
- Tab Navigator con `createBottomTabNavigator` y 2 pestañas, con íconos de `@expo/vector-icons` (Ionicons) que cambian entre contorno y relleno según la pestaña activa.
- Stack anidado dentro de la pestaña Catálogo (con `headerShown: false` en la pestaña para evitar headers dobles).
- Tipado del árbol de navegación con TypeScript, sin `any`.
- Título dinámico del detalle a partir de los parámetros (`route.params.name`).
- Estilos con las constantes `COLORS`, `TYPOGRAPHY`, `SPACING` y `RADIUS` de `src/theme/index.ts`.
- Se conserva lo de la Semana 02: `FlatList` con `keyExtractor` por `id`, búsqueda con `useMemo`, `useCallback`, estado vacío y `KeyboardAvoidingView`.

---

## 🎨 Decisiones de diseño

- **Header propio en el catálogo:** la lista usa `headerShown: false` para conservar el header fijo "Casa Musical" con la búsqueda justo debajo. El detalle sí usa el header nativo del Stack, con botón de volver.
- **Parámetros completos al detalle:** al tocar una tarjeta se envían todos los campos del instrumento como parámetros, y el detalle los lee con `useRoute`.
- **Pestañas con nombre del dominio:** las etiquetas son "Catálogo" y "Favoritos".
- **Íconos que cambian de estado:** `home` / `home-outline` y `heart` / `heart-outline`, según la pestaña activa.
- **Tarjeta reutilizada:** `ItemCard` de la Semana 02 se mantiene y ahora navega al detalle al presionarla.
- **Tema oscuro:** el header, las pestañas y el detalle usan los colores del tema (`COLORS`), por lo que toda la app se ve consistente.

---

## 🗂️ Estructura

```
src/
├── components/ItemCard.tsx        ← Tarjeta reutilizable
├── data/mockData.ts               ← 12 instrumentos y favoritos
├── navigation/
│   ├── RootNavigator.tsx          ← Tabs + Stack anidado
│   └── types.ts                   ← Tipos de los navegadores
├── screens/
│   ├── DetailScreen.tsx           ← Detalle del instrumento
│   ├── FavoritesScreen.tsx        ← Lista de favoritos
│   └── HomeScreen.tsx             ← Header, búsqueda y lista
├── theme/index.ts                 ← COLORS, TYPOGRAPHY, SPACING, RADIUS
└── types/index.ts                 ← Item e ItemCategory
```

---

## 🛠️ Tecnologías

- Expo (SDK 58), React Native y TypeScript
- React Navigation 7: `@react-navigation/native`, `native-stack` y `bottom-tabs`
- `react-native-screens` y `react-native-safe-area-context`
- `@expo/vector-icons`
- pnpm como gestor de paquetes

---

## 🚀 Cómo ejecutar

```bash
pnpm install
pnpm start
```

Luego escanea el QR con Expo Go, o presiona `a` (Android) / `i` (iOS).

---

## 🌿 Ramas

| Rama | Contenido |
|------|-----------|
| `week-1` | App de tarjetas con Core Components y Flexbox |
| `week-2` | Lista con búsqueda, `FlatList` y theming |
| `week-3` | Navegación con Tabs y Stack (React Navigation 7) |
