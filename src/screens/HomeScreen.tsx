import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ListRenderItem,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import type { Instrument } from '../types';
import { useInstruments } from '../hooks/useInstruments';
import { getErrorMessage } from '../services/api';
import { ItemCard } from '../components/ItemCard';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../theme';
import type { HomeStackParamList } from '../navigation/types';

// Tipo del navigation hook para este Stack
type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeList'
>;

function ItemSeparator(): React.JSX.Element {
  return <View style={styles.separator} />;
}

export function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [query, setQuery] = useState<string>('');

  const { data, isLoading, isError, isFetching, error, refetch } = useInstruments();

  // La búsqueda filtra en cliente sobre lo que ya trajo la query
  const filteredItems = useMemo(() => {
    if (!data) return [];
    const lower = query.trim().toLowerCase();
    if (!lower) return data;
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.brand.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower),
    );
  }, [data, query]);

  // Al detalle solo viajan id y name; el resto lo pide DetailScreen a la API
  const handleItemPress = useCallback(
    (item: Instrument): void => {
      navigation.navigate('HomeDetail', { id: item.id, name: item.name });
    },
    [navigation],
  );

  const handleRefresh = useCallback((): void => {
    void refetch();
  }, [refetch]);

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        {query.trim() ? (
          <>
            <Text style={styles.emptyText}>Sin resultados para "{query}"</Text>
            <Text style={styles.emptySubText}>
              Prueba con otro nombre, marca o categoría
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.emptyText}>No hay instrumentos disponibles</Text>
            <Text style={styles.emptySubText}>
              Desliza hacia abajo para actualizar o agrega uno nuevo
            </Text>
          </>
        )}
      </View>
    ),
    [query],
  );

  const renderItem: ListRenderItem<Instrument> = useCallback(
    ({ item }) => <ItemCard item={item} onPress={handleItemPress} />,
    [handleItemPress],
  );

  function renderBody(): React.JSX.Element {
    // Primer fetch, sin caché todavía
    if (isLoading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.centeredText}>Cargando instrumentos...</Text>
        </View>
      );
    }

    // Error sin datos previos: no hay nada que mostrar
    if (isError && !data) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>No se pudo cargar el catálogo</Text>
          <Text style={styles.centeredText}>{getErrorMessage(error)}</Text>
          <Pressable
            style={styles.retryButton}
            onPress={handleRefresh}
            accessibilityRole="button"
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <>
        {/* Error al refrescar, pero hay datos en caché que seguimos mostrando */}
        {isError && (
          <Text style={styles.staleBanner}>
            No se pudo actualizar. Mostrando los últimos datos guardados.
          </Text>
        )}
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onRefresh={handleRefresh}
          refreshing={isFetching}
        />
      </>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.kvContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            {/* Header fijo */}
            <View style={styles.header}>
              <View style={styles.headerTexts}>
                <Text style={styles.headerTitle}>Casa Musical</Text>
                <Text style={styles.headerSubtitle}>
                  Tienda de instrumentos musicales
                </Text>
              </View>
              <Pressable
                style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
                onPress={() => navigation.navigate('HomeCreate')}
                accessibilityRole="button"
                accessibilityLabel="Agregar instrumento"
              >
                <Ionicons name="add" size={26} color={COLORS.background} />
              </Pressable>
            </View>

            {/* Búsqueda fija */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar instrumento, marca o categoría..."
                placeholderTextColor={COLORS.textMuted}
                value={query}
                onChangeText={setQuery}
                keyboardType="default"
                returnKeyType="search"
                clearButtonMode="while-editing"
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>

            {/* Solo esto cambia según el estado de la red */}
            {renderBody()}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  kvContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  inner: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTexts: {
    flex: 1,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.md,
  },
  addButtonPressed: {
    opacity: 0.8,
  },
  searchContainer: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.base,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.size.base,
  },
  listContent: {
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xl,
    flexGrow: 1,
  },
  separator: {
    height: 1,
    marginHorizontal: SPACING.base,
    backgroundColor: COLORS.borderLight,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.xxl,
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
  staleBanner: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.warning,
    textAlign: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.base,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: SPACING.xxl,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  emptySubText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});