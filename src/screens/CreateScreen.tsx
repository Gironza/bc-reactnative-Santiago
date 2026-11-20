import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCreateInstrument } from '../hooks/useInstruments';
import { getErrorMessage } from '../services/api';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { HomeStackParamList } from '../navigation/types';
import type { InstrumentCategory } from '../types';

type CreateNavProp = NativeStackNavigationProp<HomeStackParamList, 'HomeCreate'>;

const CATEGORIES: InstrumentCategory[] = ['cuerda', 'viento', 'percusión', 'teclado'];

export function CreateScreen(): React.JSX.Element {
  const navigation = useNavigation<CreateNavProp>();

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [priceText, setPriceText] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<InstrumentCategory>('cuerda');
  const [inStock, setInStock] = useState(true);
  // Los errores de validación solo se muestran después del primer intento de envío
  const [submitted, setSubmitted] = useState(false);

  const { mutate, isPending, isError, error } = useCreateInstrument();

  // El precio se escribe solo con dígitos (COP, sin decimales)
  const price = Number(priceText.replace(/\D/g, ''));

  const nameError = name.trim() === '' ? 'El nombre es obligatorio' : null;
  const brandError = brand.trim() === '' ? 'La marca es obligatoria' : null;
  const priceError = price > 0 ? null : 'Ingresa un precio mayor a 0';
  const isValid = !nameError && !brandError && !priceError;

  function handleSubmit(): void {
    setSubmitted(true);
    if (!isValid || isPending) return;

    mutate(
      {
        name: name.trim(),
        brand: brand.trim(),
        description: description.trim(),
        price,
        category,
        inStock,
      },
      {
        // Corre después de que el hook invalidó la lista
        onSuccess: () => navigation.goBack(),
      },
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>
            Nombre <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ej. Guitarra clásica C40"
            placeholderTextColor={COLORS.textMuted}
            returnKeyType="next"
            editable={!isPending}
          />
          {submitted && nameError && <Text style={styles.fieldError}>{nameError}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>
            Marca <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={brand}
            onChangeText={setBrand}
            placeholder="Ej. Yamaha"
            placeholderTextColor={COLORS.textMuted}
            returnKeyType="next"
            editable={!isPending}
          />
          {submitted && brandError && <Text style={styles.fieldError}>{brandError}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>
            Precio (COP) <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={priceText}
            onChangeText={setPriceText}
            placeholder="Ej. 689000"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="number-pad"
            editable={!isPending}
          />
          {submitted && priceError && <Text style={styles.fieldError}>{priceError}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Categoría</Text>
          <View style={styles.chips}>
            {CATEGORIES.map((option) => {
              const selected = option === category;
              return (
                <Pressable
                  key={option}
                  onPress={() => setCategory(option)}
                  disabled={isPending}
                  style={[styles.chip, selected && styles.chipSelected]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={[styles.field, styles.switchRow]}>
          <Text style={styles.fieldLabel}>Disponible en stock</Text>
          <Switch
            value={inStock}
            onValueChange={setInStock}
            disabled={isPending}
            trackColor={{ false: COLORS.border, true: COLORS.accentDim }}
            thumbColor={inStock ? COLORS.accent : COLORS.textSecondary}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={description}
            onChangeText={setDescription}
            placeholder="Descripción opcional…"
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!isPending}
          />
        </View>

        {isError && (
          <Text style={styles.submitError}>
            No se pudo crear el instrumento. {getErrorMessage(error)}
          </Text>
        )}

        <Pressable
          style={[styles.button, isPending && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isPending}
          accessibilityRole="button"
        >
          {isPending ? (
            <ActivityIndicator size="small" color={COLORS.background} />
          ) : (
            <Text style={styles.buttonText}>Crear instrumento</Text>
          )}
        </Pressable>

        <Pressable
          style={styles.cancel}
          onPress={() => navigation.goBack()}
          disabled={isPending}
          accessibilityRole="button"
        >
          <Text style={styles.cancelText}>Cancelar</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  content: { padding: SPACING.base, gap: SPACING.md, paddingBottom: SPACING.xxl },
  field: { gap: SPACING.xs },
  fieldLabel: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.medium,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  required: { color: COLORS.error },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.base,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.size.base,
  },
  multiline: { minHeight: 96 },
  fieldError: { fontSize: TYPOGRAPHY.size.sm, color: COLORS.error },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  chip: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  chipSelected: { borderColor: COLORS.accent, backgroundColor: COLORS.accentDim },
  chipText: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.medium,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
  chipTextSelected: { color: COLORS.accent },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  submitError: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.error,
    textAlign: 'center',
  },
  button: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.background,
  },
  cancel: { alignItems: 'center', padding: SPACING.sm },
  cancelText: { fontSize: TYPOGRAPHY.size.base, color: COLORS.textMuted },
});