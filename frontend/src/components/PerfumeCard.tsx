// Placeholder card to visualize perfume info during prototyping.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Perfume } from '../types/domain';

type Props = {
  perfume: Perfume;
};

const PerfumeCard: React.FC<Props> = ({ perfume }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{perfume.name}</Text>
      <Text style={styles.subtitle}>{perfume.brand}</Text>
      <Text style={styles.notesLabel}>Notas</Text>
      <Text style={styles.notes}>{perfume.notes.join(', ') || 'No definido'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    width: '100%',
    gap: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  notesLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  notes: {
    fontSize: 12,
    color: '#374151',
  },
});

export default PerfumeCard;
