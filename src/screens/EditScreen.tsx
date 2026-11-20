import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { InstrumentFormFields } from '../components/InstrumentFormFields';
import { useInstrument, useUpdateInstrument } from '../hooks/useInstruments';
import { instrumentSchema } from '../schemas/instrumentSchema';
import type {
  InstrumentFormData,
  InstrumentFormInput,
} from '../schemas/instrumentSchema';
import { getErrorMessage } from '../services/api';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { HomeStackParamList } from '../navigation/types';

type EditNavProp = NativeStackNavigationProp<HomeStackParamList, 'HomeEdit'>;
type EditRouteProp = RouteProp<HomeStackParamList, 'HomeEdit'>;

export function EditScreen(): React.JSX.Element {
  const navigation = useNavigation<EditNavProp>();
  const { id } = useRoute<EditRouteProp>().params;

  // Todos los hooks van antes de cualquier return anticipado
  const {
    data: item,
    isLoading,
    isError,
    error,
    isPlaceholderData,
    refetch,
  } = useInstrument(id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
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

  const {
    mutate,
    isPending,
    isError: isSaveError,
    error: saveError,
  } = useUpdateInstrument();

  // Cuando llegan los datos reales del servidor se rellena el formulario.
  // - isPlaceholderData: ignora la copia provisional de la caché de la lista.
  // - keepDirtyValues: si el usuario ya escribió algo, un refetch no se lo pisa.
  useEffect(() => {
    if (!item || isPlaceholderData) return;
    reset(
      {
        name: item.name,
        brand: item.brand,
        price: String(item.price),
        category: item.category,
        inStock: item.inStock,
        description: item.description ?? '',
      },
      { keepDirtyValues: true },
    );
  }, [item, isPlaceholderData, reset]);

  function onSubmit(data: InstrumentFormData): void {
    mutate(
      { id, data },
      // Corre después de que el hook invalidó la lista y el detalle
      { onSuccess: () => navigation.goBack() },
    );
  }

  if (isLoading || (isPlaceholderData && !isError)) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  if (isError || !item) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>No se pudo cargar el instrumento</Text>
        <Text style={styles.centeredText}>{getErrorMessage(error)}</Text>
        <Pressable
          style={styles.retryButton}
          onPress={() => void refetch()}
          accessibilityRole="button"
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  const busy = isSubmitting || isPending;
  // Sin cambios no tiene sentido guardar
  const canSubmit = isDirty && !busy;

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

        {isSaveError && (
          <Text style={styles.submitError}>
            No se pudo guardar. {getErrorMessage(saveError)}
          </Text>
        )}

        <Pressable
          style={[styles.button, !canSubmit && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={!canSubmit}
          accessibilityRole="button"
        >
          {busy ? (
            <ActivityIndicator size="small" color={COLORS.background} />
          ) : (
            <Text style={styles.buttonText}>Guardar cambios</Text>
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    backgroundColor: COLORS.background,
  },
  centeredText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.error,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
  },
  retryButtonText: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.background,
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
  buttonDisabled: { opacity: 0.45 },
  buttonText: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.background,
  },
  cancel: { alignItems: 'center', padding: SPACING.sm },
  cancelText: { fontSize: TYPOGRAPHY.size.base, color: COLORS.textMuted },
});