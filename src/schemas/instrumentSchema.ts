import { z } from 'zod';

// Fuente única de las categorías: el schema y la UI (chips) usan esta lista.
export const INSTRUMENT_CATEGORIES = ['cuerda', 'viento', 'percusión', 'teclado'] as const;

export const instrumentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .max(80, 'Máx. 80 caracteres'),

  brand: z
    .string()
    .trim()
    .min(1, 'La marca es obligatoria')
    .max(40, 'Máx. 40 caracteres'),

  // TextInput siempre entrega string: z.coerce lo convierte a número antes de validar
  price: z.coerce
    .number({ message: 'Ingresa un número válido' })
    .int('Debe ser un número entero (COP, sin decimales)')
    .positive('Ingresa un precio mayor a 0'),

  category: z.enum(INSTRUMENT_CATEGORIES, { message: 'Selecciona una categoría' }),

  inStock: z.boolean(),

  // Opcional: puede quedar vacía, pero siempre es string (el payload lo espera así)
  description: z.string().trim().max(500, 'Máx. 500 caracteres'),
});

// Con z.coerce, lo que entra al formulario (input) y lo que sale validado (output)
// son tipos distintos: price entra como unknown y sale como number.
export type InstrumentFormInput = z.input<typeof instrumentSchema>;
export type InstrumentFormData = z.output<typeof instrumentSchema>;