// Pills for usage/occasion tags.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  tags?: string[];
};

const UsageTags: React.FC<Props> = ({ tags = [] }) => {
  if (tags.length === 0) return null;

  return (
    <View style={styles.row}>
      {tags.map((tag) => (
        <View key={tag} style={styles.tag}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
});

export default UsageTags;
