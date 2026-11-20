import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Controller } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';

import { FormField } from './FormField';
import { INSTRUMENT_CATEGORIES } from '../schemas/instrumentSchema';
import type {
  InstrumentFormData,
  InstrumentFormInput,
} from '../schemas/instrumentSchema';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

interface InstrumentFormFieldsProps {
  control: Control<InstrumentFormInput, unknown, InstrumentFormData>;
  errors: FieldErrors<InstrumentFormInput>;
  disabled?: boolean;
}

// Campos del formulario de instrumento. Los usan CreateScreen y EditScreen.
export function InstrumentFormFields({
  control,
  errors,
  disabled = false,
}: InstrumentFormFieldsProps): React.JSX.Element {
  return (
    <>
      <FormField
        control={control}
        name="name"
        label="Nombre"
        required
        placeholder="Ej. Guitarra clásica C40"
        returnKeyType="next"
        editable={!disabled}
        errorMessage={errors.name?.message}
      />

      <FormField
        control={control}
        name="brand"
        label="Marca"
        required
        placeholder="Ej. Yamaha"
        returnKeyType="next"
        editable={!disabled}
        errorMessage={errors.brand?.message}
      />

      <FormField
        control={control}
        name="price"
        label="Precio (COP)"
        required
        placeholder="Ej. 689000"
        keyboardType="number-pad"
        editable={!disabled}
        errorMessage={errors.price?.message}
      />

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Categoría</Text>
        <Controller
          control={control}
          name="category"
          render={({ field: { value, onChange } }) => (
            <View style={styles.chips}>
              {INSTRUMENT_CATEGORIES.map((option) => {
                const selected = option === value;
                return (
                  <Pressable
                    key={option}
                    onPress={() => onChange(option)}
                    disabled={disabled}
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
          )}
        />
        {errors.category?.message && (
          <Text style={styles.fieldError}>{errors.category.message}</Text>
        )}
      </View>

      <View style={[styles.field, styles.switchRow]}>
        <Text style={styles.fieldLabel}>Disponible en stock</Text>
        <Controller
          control={control}
          name="inStock"
          render={({ field: { value, onChange } }) => (
            <Switch
              value={value}
              onValueChange={onChange}
              disabled={disabled}
              trackColor={{ false: COLORS.border, true: COLORS.accentDim }}
              thumbColor={value ? COLORS.accent : COLORS.textSecondary}
            />
          )}
        />
      </View>

      <FormField
        control={control}
        name="description"
        label="Descripción"
        placeholder="Descripción opcional…"
        multiline
        numberOfLines={4}
        editable={!disabled}
        errorMessage={errors.description?.message}
      />
    </>
  );
}

const styles = StyleSheet.create({
  field: { gap: SPACING.xs },
  fieldLabel: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.medium,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
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
});