# Casa Musical — App móvil (React Native + Expo SDK 57)

App de una **tienda de instrumentos musicales** construida paso a paso, una rama por semana (`week-1`, `week-2`, …).
Esta rama corresponde a la **Semana 01 — Fundamentos de React Native**: una pantalla única con una lista de tarjetas usando Core Components y Flexbox.

## Requisitos
- Node.js 22+
- pnpm (`corepack enable` y listo)
- Expo Go **SDK 57** en el celular, o un simulador iOS / Android

## Ejecutar
```bash
cd starter
pnpm install
pnpm start        # escanear el QR con Expo Go
```

## Qué incluye la Semana 01
- Header con el nombre de la tienda y su subtítulo.
- Lista de tarjetas con `ScrollView` (mínimo 4 instrumentos).
- Cada tarjeta muestra imagen, nombre, subtítulo (marca · categoría), precio y disponibilidad.
- Botón con `Pressable` y feedback visual al presionar (opacidad y escala).
- Estilos con `StyleSheet.create`, sin estilos inline ni `position: 'absolute'`.
- TypeScript estricto con la interfaz `Instrument`.

## Estructura
```
starter/
├── App.tsx                    # Punto de entrada
├── app.json                   # Configuración de Expo
├── package.json
├── tsconfig.json
└── src/
    ├── types/index.ts         # Interfaz Instrument
    ├── data/mockData.ts       # Datos de ejemplo (instrumentos)
    ├── components/ItemCard.tsx  # Tarjeta reutilizable
    └── screens/HomeScreen.tsx   # Pantalla principal
```

## Modelo de datos
```ts
interface Instrument {
  id: string;
  name: string;
  subtitle: string;   // marca · categoría
  price: number;
  imageUri: string;
  inStock: boolean;
}
```

## Restricciones de la actividad
- Solo Flexbox (sin `position: 'absolute'`).
- Sin librerías de UI externas, solo componentes nativos de React Native.
- Sin estilos inline en el JSX.
- Todo el código en TypeScript con tipos explícitos.

## Ramas
- `week-1`: esta semana (app de tarjetas).
- Cada rama nueva parte de la anterior.