import type { Item } from '../types';

export const ITEMS: Item[] = [
  { id: '1', name: 'Guitarra acústica F310', description: 'Guitarra acústica de cuerdas de acero con tapa de abeto, ideal para quienes empiezan.', brand: 'Yamaha', price: 689000, category: 'cuerda', inStock: true },
  { id: '2', name: 'Guitarra eléctrica Player Stratocaster', description: 'Guitarra eléctrica con tres micrófonos single coil y sonido versátil para rock, pop y blues.', brand: 'Fender', price: 4299000, category: 'cuerda', inStock: true },
  { id: '3', name: 'Bajo eléctrico Jazz Bass', description: 'Bajo eléctrico de cuatro cuerdas con mástil delgado y tono cálido.', brand: 'Squier', price: 1850000, category: 'cuerda', inStock: false },
  { id: '4', name: 'Ukelele soprano', description: 'Ukelele compacto y liviano, perfecto para aprender y llevar a todas partes.', brand: 'Kala', price: 420000, category: 'cuerda', inStock: true },
  { id: '5', name: 'Piano digital P-45', description: 'Piano digital de 88 teclas con acción de martillo graduada y sonido realista.', brand: 'Yamaha', price: 2490000, category: 'teclado', inStock: true },
  { id: '6', name: 'Teclado CT-S300', description: 'Teclado portátil de 61 teclas con ritmos y sonidos integrados.', brand: 'Casio', price: 780000, category: 'teclado', inStock: true },
  { id: '7', name: 'Batería acústica Stagestar', description: 'Set de batería acústica completo para estudio, ensayo y presentaciones.', brand: 'Tama', price: 3950000, category: 'percusión', inStock: false },
  { id: '8', name: 'Cajón flamenco', description: 'Cajón de percusión con sonido flamenco, fácil de transportar.', brand: 'Meinl', price: 520000, category: 'percusión', inStock: true },
  { id: '9', name: 'Bongós', description: 'Par de bongós para percusión latina, con tonos agudo y grave.', brand: 'LP', price: 390000, category: 'percusión', inStock: true },
  { id: '10', name: 'Saxofón alto YAS-280', description: 'Saxofón alto para estudiantes, de respuesta fácil y buena afinación.', brand: 'Yamaha', price: 6900000, category: 'viento', inStock: true },
  { id: '11', name: 'Flauta traversa YFL-222', description: 'Flauta traversa para estudiantes, con sonido claro y mecánica confiable.', brand: 'Yamaha', price: 2100000, category: 'viento', inStock: false },
  { id: '12', name: 'Armónica Marine Band', description: 'Armónica diatónica de 10 agujeros, clásica en el blues y el folk.', brand: 'Hohner', price: 190000, category: 'viento', inStock: true },
];

// Subconjunto de instrumentos para la pestaña Favoritos
export const FAVORITES: Item[] = [ITEMS[0], ITEMS[4], ITEMS[9]];