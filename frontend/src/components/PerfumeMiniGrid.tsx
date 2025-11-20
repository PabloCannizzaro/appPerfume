// Simple grid wrapper for mini perfume cards.
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Perfume } from '../types/domain';
import PerfumeMiniCard from './PerfumeMiniCard';

type Props = {
  perfumes: Perfume[];
  onPressItem: (perfumeId: string) => void;
};

const PerfumeMiniGrid: React.FC<Props> = ({ perfumes, onPressItem }) => {
  return (
    <View style={styles.grid}>
      {perfumes.map((perfume) => (
        <PerfumeMiniCard key={perfume.id} perfume={perfume} onPress={() => onPressItem(perfume.id)} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});

export default PerfumeMiniGrid;
