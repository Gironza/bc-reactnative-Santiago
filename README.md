# 🎸 Tienda de Instrumentos Musicales — Semana 02

App móvil hecha con **React Native + Expo + TypeScript** que lista el catálogo de una tienda de instrumentos musicales y permite filtrarlo en tiempo real.

> Rama: `week-2` · Bootcamp de React Native · Semana 02: Listas con búsqueda

---

## 🧩 Dominio

**Tienda de instrumentos musicales.** Cada elemento del catálogo es un instrumento con estos campos:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `string` | Identificador único |
| `name` | `string` | Nombre del instrumento |
| `brand` | `string` | Marca |
| `price` | `number` | Precio en COP |
| `category` | `'cuerda' \| 'viento' \| 'percusión' \| 'teclado'` | Categoría |
| `inStock` | `boolean` | Disponibilidad |

El catálogo tiene **12 instrumentos** en `src/data/mockData.ts`, repartidos en las 4 categorías, y 3 de ellos están agotados para poder ver los dos estados.

---

## 📱 Pantallas

![Pantalla principal](./assets/screenshot-home.png)

**HomeScreen** (única pantalla):
- Barra de búsqueda en la parte superior.
- Lista de tarjetas con nombre, marca, precio, disponibilidad y badge de categoría.
- Estado vacío cuando la búsqueda no encuentra nada: `Sin resultados para "..."` con una sugerencia.

---

## ✅ Requisitos implementados

- `FlatList` con `keyExtractor` por `id` y separador entre tarjetas.
- Búsqueda en tiempo real con `TextInput` controlado (por nombre, marca o categoría).
- `useMemo` para el filtrado y `useCallback` para `renderItem` y el estado vacío.
- Componente reutilizable `ItemCard` con más de 3 campos.
- `KeyboardAvoidingView` con comportamiento distinto por plataforma, `keyboardShouldPersistTaps` y cierre del teclado al tocar fuera.
- Estilos con las constantes `COLORS`, `TYPOGRAPHY`, `SPACING` y `RADIUS` de `src/theme/index.ts`.
- TypeScript estricto, sin `any`.

---

## 🎨 Decisiones de diseño

- **Tema oscuro y color de acento:** se mantiene la paleta del starter, con el acento `COLORS.accent` en precio y badges para que lo importante resalte.
- **Búsqueda por tres campos:** en una tienda la gente busca por marca o categoría además del nombre, así que el filtro revisa los tres.
- **Disponibilidad por color:** verde para "Disponible" y rojo para "Agotado", con texto además del color para que no dependa solo de él.
- **Precio formateado a mano:** `formatPrice` agrega los puntos de miles con una expresión regular, para que se vea igual en Android e iOS.
- **Separador fuera del componente:** `ItemSeparator` se define fuera de `HomeScreen` para que no se recree en cada render.
- **Cierre del teclado:** el teclado se cierra al tocar fuera y también al hacer scroll (`keyboardDismissMode="on-drag"`).

---

## 🗂️ Estructura

```
src/
├── components/ItemCard.tsx   ← Tarjeta reutilizable
├── data/mockData.ts          ← 12 instrumentos
├── screens/HomeScreen.tsx    ← FlatList + búsqueda
├── theme/index.ts            ← COLORS, TYPOGRAPHY, SPACING, RADIUS
└── types/index.ts            ← Item e ItemCategory
```

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