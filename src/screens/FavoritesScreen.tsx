import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { formatPrice } from '../components/ItemCard';
import { ITEMS } from '../data/mockData';
import { useFavoritesStore } from '../stores/favoritesStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import type { Item } from '../types';

function ItemSeparator(): React.JSX.Element {
  return <View style={styles.separator} />;
}

export function FavoritesScreen(): React.JSX.Element {
  // Se selecciona el array crudo y se deriva fuera del selector (Zustand 5)
  const ids = useFavoritesStore((s) => s.ids);
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite);
  const clearFavorites = useFavoritesStore((s) => s.clearFavorites);

  const favorites = useMemo(
    () =>
      ids
        .map((id) => ITEMS.find((i) => i.id === id))
        .filter((i): i is Item => i !== undefined),
    [ids],
  );

  function renderFavorite({ item }: { item: Item }): React.JSX.Element {
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
  clearButton: { alignSelf: 'flex-end', paddingBottom: SPACING.md },
  clearText: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.error,
  },
  emptyContainer: { paddingTop: SPACING.xxl, alignItems: 'center' },
  emptyText: { fontSize: TYPOGRAPHY.size.base, color: COLORS.textMuted },
});