import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { usePreferences } from '../hooks/usePreferences';
import type { SortOrder } from '../hooks/usePreferences';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

// Dato sensible de la tienda: PIN de caja (solo demostración)
const PIN_KEY = 'sec_cashier_pin';
const DEMO_PIN = '4821';

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'asc', label: 'A → Z' },
  { value: 'desc', label: 'Z → A' },
];

const PAGE_SIZES = [5, 10, 20] as const;

export function SettingsScreen(): React.JSX.Element {
  const {
    sortOrder,
    setSortOrder,
    compactMode,
    setCompactMode,
    itemsPerPage,
    setItemsPerPage,
  } = usePreferences();

  // Solo confirmaciones: el PIN nunca se muestra en pantalla
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    void SecureStore.getItemAsync(PIN_KEY).then((value) => {
      setMessage(value !== null ? 'Hay un PIN guardado.' : 'No hay PIN guardado.');
    });
  }, []);

  async function handleSave(): Promise<void> {
    await SecureStore.setItemAsync(PIN_KEY, DEMO_PIN);
    setMessage('PIN guardado de forma segura.');
  }

  async function handleRead(): Promise<void> {
    const value = await SecureStore.getItemAsync(PIN_KEY);
    setMessage(
      value !== null
        ? `PIN leído correctamente (${value.length} dígitos).`
        : 'No hay PIN guardado.',
    );
  }

  async function handleDelete(): Promise<void> {
    await SecureStore.deleteItemAsync(PIN_KEY);
    setMessage('PIN eliminado.');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Preferencias (MMKV): se guardan al instante, sin botón "Guardar" */}
      <Text style={styles.sectionTitle}>Preferencias</Text>

      <View style={styles.row}>
        <View style={styles.rowInfo}>
          <Text style={styles.rowLabel}>Modo compacto</Text>
          <Text style={styles.rowDesc}>Muestra menos información en cada tarjeta</Text>
        </View>
        <Switch
          value={compactMode}
          onValueChange={setCompactMode}
          trackColor={{ false: COLORS.border, true: COLORS.accent }}
          thumbColor={COLORS.textPrimary}
        />
      </View>

      <View style={styles.rowColumn}>
        <Text style={styles.rowLabel}>Orden del catálogo</Text>
        <View style={styles.segmented}>
          {SORT_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              style={[styles.segment, sortOrder === option.value && styles.segmentActive]}
              onPress={() => setSortOrder(option.value)}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.segmentText,
                  sortOrder === option.value && styles.segmentTextActive,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.rowColumn}>
        <Text style={styles.rowLabel}>Ítems por página</Text>
        <View style={styles.segmented}>
          {PAGE_SIZES.map((size) => (
            <Pressable
              key={size}
              style={[styles.segment, itemsPerPage === size && styles.segmentActive]}
              onPress={() => setItemsPerPage(size)}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.segmentText,
                  itemsPerPage === size && styles.segmentTextActive,
                ]}
              >
                {size}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Seguridad (SecureStore): dato cifrado en Keystore */}
      <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Seguridad</Text>
      <Text style={styles.rowDesc}>
        El PIN de caja se guarda cifrado en el dispositivo y nunca se muestra en pantalla.
      </Text>

      <View style={styles.actions}>
        <Pressable style={styles.button} onPress={() => void handleSave()}>
          <Text style={styles.buttonText}>Guardar</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.buttonOutline]} onPress={() => void handleRead()}>
          <Text style={[styles.buttonText, styles.buttonOutlineText]}>Leer</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.buttonDanger]} onPress={() => void handleDelete()}>
          <Text style={[styles.buttonText, styles.buttonDangerText]}>Eliminar</Text>
        </Pressable>
      </View>

      {message !== '' && <Text style={styles.message}>{message}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.base,
    paddingBottom: SPACING.xxl,
    gap: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  sectionSpacing: {
    marginTop: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.base,
  },
  rowInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  rowColumn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    gap: SPACING.sm,
  },
  rowLabel: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
  },
  rowDesc: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
  segmented: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  segment: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
  },
  segmentActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  segmentText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
  segmentTextActive: {
    color: COLORS.background,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
  },
  buttonText: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.background,
  },
  buttonOutline: {
    backgroundColor: COLORS.surface,
  },
  buttonOutlineText: {
    color: COLORS.accent,
  },
  buttonDanger: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.error,
  },
  buttonDangerText: {
    color: COLORS.error,
  },
  message: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.success,
  },
});