// Simple star rating component (display + editable).
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
  value: number;
  editable?: boolean;
  onChange?: (next: number) => void;
  size?: number;
};

const RatingStars: React.FC<Props> = ({ value, editable = false, onChange, size = 18 }) => {
  return (
    <View style={styles.row}>
      {[0, 1, 2, 3, 4].map((index) => {
        const filled = index < Math.round(value);
        return (
          <TouchableOpacity
            key={index}
            disabled={!editable}
            onPress={() => onChange?.(index + 1)}
            style={styles.hitbox}
          >
            <Text style={[styles.star, { fontSize: size }]}>{filled ? '*' : 'o'}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hitbox: {
    padding: 2,
  },
  star: {
    color: '#f59e0b',
  },
});

export default RatingStars;
