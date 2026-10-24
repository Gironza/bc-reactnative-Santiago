import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Instrument } from '../types';

interface ItemCardProps {
  item: Instrument;
  onPress: (item: Instrument) => void;
}

export function ItemCard({ item, onPress }: ItemCardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUri }} style={styles.cardImage} resizeMode="cover" />

      <View style={styles.cardBody}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>

        <View style={styles.row}>
          <Text style={styles.price}>${item.price.toLocaleString('es-CO')}</Text>
          <Text style={item.inStock ? styles.stockOn : styles.stockOff}>
            {item.inStock ? 'Disponible' : 'Agotado'}
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            !item.inStock && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => onPress(item)}
        >
          <Text style={styles.buttonText}>
            {item.inStock ? 'Agregar al carrito' : 'Avisarme'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#161b22',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#30363d',
  },
  cardImage: { width: '100%', height: 160 },
  cardBody: { padding: 16, gap: 4 },
  cardName: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  cardSubtitle: { fontSize: 14, color: '#8b949e' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: { fontSize: 20, fontWeight: '700', color: '#58a6ff' },
  stockOn: { fontSize: 12, color: '#3fb950', fontStyle: 'italic' },
  stockOff: { fontSize: 12, color: '#f85149', fontStyle: 'italic' },
  button: {
    marginTop: 12,
    backgroundColor: '#238636',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#6e7681' },
  buttonPressed: { opacity: 0.6, transform: [{ scale: 0.97 }] },
  buttonText: { color: '#ffffff', fontWeight: '600', fontSize: 14 },
});