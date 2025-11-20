// Compact card used in profile lists.
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Perfume } from '../types/domain';

type Props = {
  perfume: Perfume;
  onPress?: () => void;
  width?: number;
};

const placeholderImage = 'https://via.placeholder.com/150x150.png?text=Perfume';

const PerfumeMiniCard: React.FC<Props> = ({ perfume, onPress, width = 140 }) => {
  return (
    <TouchableOpacity style={[styles.card, { width }]} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: perfume.imageUrl || placeholderImage }} style={[styles.image, { width: width - 16 }]} />
      <View style={styles.textBlock}>
        <Text style={styles.title} numberOfLines={1}>
          {perfume.name}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {perfume.brand}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 6,
  },
  image: {
    height: 120,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
    alignSelf: 'center',
  },
  textBlock: {
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default PerfumeMiniCard;
