import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ListRenderItem,
} from 'react-native';
import { Item } from '../types';
import { ITEMS } from '../data/mockData';
import { ItemCard } from '../components/ItemCard';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../theme';

function ItemSeparator(): React.JSX.Element {
  return <View style={styles.separator} />;
}

export function HomeScreen(): React.JSX.Element {
  const [query, setQuery] = useState<string>('');

  const filteredItems = useMemo(() => {
    const lower = query.trim().toLowerCase();
    if (!lower) return ITEMS;
    return ITEMS.filter(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.brand.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower),
    );
  }, [query]);

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Sin resultados para "{query}"</Text>
        <Text style={styles.emptySubText}>
          Prueba con otro nombre, marca o categoría
        </Text>
      </View>
    ),
    [query],
  );

  const renderItem: ListRenderItem<Item> = useCallback(
    ({ item }) => (
      <ItemCard item={item} onPress={() => console.log('Seleccionado:', item.name)} />
    ),
    [],
  );

  return (
    <KeyboardAvoidingView
      style={styles.kvContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          {/* Header fijo */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Casa Musical</Text>
            <Text style={styles.headerSubtitle}>Tienda de instrumentos musicales</Text>
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

          {/* Solo esto se desplaza */}
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={renderEmpty}
            ItemSeparatorComponent={ItemSeparator}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  kvContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  inner: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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