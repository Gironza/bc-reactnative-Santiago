import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { Controller } from 'react-hook-form';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

// Los 3 genéricos de Control permiten usar useForm<Input, unknown, Output>
// (necesario con z.coerce) sin recurrir a `any`.
interface FormFieldProps<
  TInput extends FieldValues,
  TContext,
  TOutput extends FieldValues | undefined,
> extends Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'> {
  control: Control<TInput, TContext, TOutput>;
  name: FieldPath<TInput>;
  label: string;
  required?: boolean;
  errorMessage?: string;
}

export function FormField<
  TInput extends FieldValues,
  TContext,
  TOutput extends FieldValues | undefined,
>({
  control,
  name,
  label,
  required = false,
  errorMessage,
  style,
  ...textInputProps
}: FormFieldProps<TInput, TContext, TOutput>): React.JSX.Element {
  const hasError = !!errorMessage;

  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              styles.input,
              textInputProps.multiline && styles.multiline,
              hasError && styles.inputError,
              style,
            ]}
            // El valor del form puede ser número (ej. price): TextInput solo acepta string
            value={value == null ? '' : String(value)}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholderTextColor={COLORS.textMuted}
            {...textInputProps}
          />
        )}
      />

      {hasError && <Text style={styles.error}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: SPACING.xs },
  label: {
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
    paddingVertical: 12,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.size.base,
  },
  multiline: { minHeight: 96, textAlignVertical: 'top' },
  inputError: { borderColor: COLORS.error },
  error: { fontSize: TYPOGRAPHY.size.sm, color: COLORS.error },
});