import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { formatPrice } from '../components/ItemCard';
import { useInstruments } from '../hooks/useInstruments';
import { getErrorMessage } from '../services/api';
import { useFavoritesStore } from '../stores/favoritesStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { Instrument } from '../types';

function ItemSeparator(): React.JSX.Element {
  return <View style={styles.separator} />;
}

export function FavoritesScreen(): React.JSX.Element {
  // Se selecciona el array crudo y se deriva fuera del selector (Zustand 5)
  const ids = useFavoritesStore((s) => s.ids);
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite);
  const clearFavorites = useFavoritesStore((s) => s.clearFavorites);

  // El catálogo viene de la API (TanStack Query); el store solo guarda los ids
  const { data, isLoading, isError, error, refetch } = useInstruments();

  // Se ignoran los ids que ya no existen en la API
  const favorites = useMemo(() => {
    if (!data) return [];
    return ids
      .map((id) => data.find((i) => i.id === id))
      .filter((i): i is Instrument => i !== undefined);
  }, [ids, data]);

  function renderFavorite({ item }: { item: Instrument }): React.JSX.Element {
    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.fieldText}>{item.brand}</Text>
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.price}>{formatPrice(item.price)} COP</Text>
        </View>
        <Pressable
          onPress={() => removeFavorite(item.id)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Quitar ${item.name} de favoritos`}
        >
          <Ionicons name="heart" size={22} color={COLORS.error} />
        </Pressable>
      </View>
    );
  }

  // Sin ids guardados no hay nada que esperar de la red
  if (ids.length > 0 && isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  if (ids.length > 0 && isError && !data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>No se pudieron cargar tus favoritos</Text>
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

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={renderFavorite}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={
          favorites.length > 0 ? (
            <Pressable
              onPress={clearFavorites}
              style={styles.clearButton}
              accessibilityRole="button"
            >
              <Text style={styles.clearText}>Limpiar todo</Text>
            </Pressable>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aún no tienes instrumentos favoritos</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: SPACING.base, flexGrow: 1 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  cardContent: { flex: 1 },
  itemName: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  fieldText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  itemDescription: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  price: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.accent,
    marginTop: SPACING.sm,
  },
  separator: { height: SPACING.sm },
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
  clearButton: { alignSelf: 'flex-end', paddingBottom: SPACING.md },
  clearText: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.error,
  },
  emptyContainer: { paddingTop: SPACING.xxl, alignItems: 'center' },
  emptyText: { fontSize: TYPOGRAPHY.size.base, color: COLORS.textMuted },
});