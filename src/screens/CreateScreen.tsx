import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { InstrumentFormFields } from '../components/InstrumentFormFields';
import { useCreateInstrument } from '../hooks/useInstruments';
import { instrumentSchema } from '../schemas/instrumentSchema';
import type {
  InstrumentFormData,
  InstrumentFormInput,
} from '../schemas/instrumentSchema';
import { getErrorMessage } from '../services/api';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { HomeStackParamList } from '../navigation/types';

type CreateNavProp = NativeStackNavigationProp<HomeStackParamList, 'HomeCreate'>;

export function CreateScreen(): React.JSX.Element {
  const navigation = useNavigation<CreateNavProp>();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InstrumentFormInput, unknown, InstrumentFormData>({
    resolver: zodResolver(instrumentSchema),
    defaultValues: {
      name: '',
      brand: '',
      price: '',
      category: 'cuerda',
      inStock: true,
      description: '',
    },
  });

  const { mutate, isPending, isError, error } = useCreateInstrument();

  // Solo se llama si Zod validó todo; `data` ya viene limpio (trim, price como número)
  function onSubmit(data: InstrumentFormData): void {
    mutate(data, {
      // Corre después de que el hook invalidó la lista
      onSuccess: () => navigation.goBack(),
    });
  }

  const busy = isSubmitting || isPending;

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
        <InstrumentFormFields control={control} errors={errors} disabled={busy} />

        {isError && (
          <Text style={styles.submitError}>
            No se pudo crear el instrumento. {getErrorMessage(error)}
          </Text>
        )}

        <Pressable
          style={[styles.button, busy && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={busy}
          accessibilityRole="button"
        >
          {busy ? (
            <ActivityIndicator size="small" color={COLORS.background} />
          ) : (
            <Text style={styles.buttonText}>Crear instrumento</Text>
          )}
        </Pressable>

        <Pressable
          style={styles.cancel}
          onPress={() => navigation.goBack()}
          disabled={busy}
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