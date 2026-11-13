// Sube los instrumentos de scripts/instruments.seed.json a tu API de MockAPI.
//
// Uso (desde la raíz del proyecto):
//   node scripts/seed.mjs                     -> usa EXPO_PUBLIC_API_URL de .env.local
//   node scripts/seed.mjs https://xxxx.mockapi.io/api/v1
//   node scripts/seed.mjs --force             -> sube aunque el recurso ya tenga datos
//
// Requiere Node 18 o superior (fetch incluido).

import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const force = args.includes('--force');
const urlArg = args.find((a) => !a.startsWith('--'));

function readEnvLocal() {
  try {
    const text = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
    const line = text.split(/\r?\n/).find((l) => l.startsWith('EXPO_PUBLIC_API_URL='));
    return line ? line.slice('EXPO_PUBLIC_API_URL='.length).trim() : undefined;
  } catch {
    return undefined;
  }
}

const baseUrl = (urlArg ?? process.env.EXPO_PUBLIC_API_URL ?? readEnvLocal() ?? '').replace(/\/+$/, '');

if (!baseUrl || baseUrl.includes('PEGA-AQUI')) {
  console.error('Falta la URL de la API. Pégala en .env.local o pásala como argumento.');
  process.exit(1);
}

const endpoint = `${baseUrl}/instruments`;
const instruments = JSON.parse(
  readFileSync(new URL('./instruments.seed.json', import.meta.url), 'utf8'),
);

const existing = await fetch(endpoint);
if (!existing.ok) {
  console.error(`No se pudo leer ${endpoint} (HTTP ${existing.status}).`);
  console.error('Revisa la URL y que el recurso se llame "instruments".');
  process.exit(1);
}

const current = await existing.json();
if (Array.isArray(current) && current.length > 0 && !force) {
  console.error(`El recurso ya tiene ${current.length} registros. Usa --force si quieres subir de todas formas.`);
  process.exit(1);
}

let created = 0;
for (const instrument of instruments) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(instrument),
  });
  if (!res.ok) {
    console.error(`Falló "${instrument.name}" (HTTP ${res.status}). Se detiene aquí.`);
    process.exit(1);
  }
  created += 1;
  console.log(`✔ ${created}/${instruments.length} ${instrument.name}`);
}

console.log('Listo. Reinicia Expo con: pnpm start -c');