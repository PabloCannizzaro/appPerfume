// Explore screen fetching perfumes from API with search and filters.
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, TabParamList } from '../navigation/types';
import { Perfume } from '../types/domain';
import { usePerfumes } from '../hooks/usePerfumes';

type ExploreNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Explore'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const quickFilters = [
  'fresco',
  'acuatico',
  'citrico',
  'tropical',
  'ozonico',
  'amaderado',
  'especiado',
  'gourmand',
  'limpio',
  'dia',
  'noche',
  'verano',
  'invierno',
  'oficina',
  'cita',
  'fiesta',
  'casual',
];
const placeholderImage = 'https://via.placeholder.com/200x200.png?text=Perfume';
const CARD_PADDING = 8;
const NUM_COLUMNS = 2;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - CARD_PADDING * (NUM_COLUMNS * 2 + 2)) / NUM_COLUMNS;

const ExploreScreen: React.FC = () => {
  const navigation = useNavigation<ExploreNavProp>();
  const { perfumes, status, error } = usePerfumes();
  const [search, setSearch] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const fade = useState(new Animated.Value(0))[0];

  const toggleFilter = (tag: string) => {
    setSelectedFilters((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]));
  };

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [fade]);

  const filteredPerfumes = useMemo(() => {
    const query = search.trim().toLowerCase();
    return perfumes.filter((perfume) => {
      const matchesText =
        query.length === 0 ||
        perfume.name.toLowerCase().includes(query) ||
        perfume.brand.toLowerCase().includes(query);

      if (!matchesText) return false;

      if (selectedFilters.length === 0) return true;

      const tags = perfume.tags ?? [];
      return selectedFilters.every((tag) => tags.includes(tag));
    });
  }, [search, selectedFilters, perfumes]);

  const renderItem = ({ item }: { item: Perfume }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PerfumeDetail', { perfumeId: item.id })} activeOpacity={0.9}>
      <Image source={{ uri: item.imageUrl || placeholderImage }} style={styles.cardImage} />
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.cardSubtitle} numberOfLines={1}>
        {item.brand}
      </Text>
      <Text style={styles.cardRating}>* {item.ratingAverage?.toFixed(1) ?? item.averageRating?.toFixed(1) ?? '4.0'}</Text>
      <View style={styles.tagRow}>
        {(item.tags ?? []).slice(0, 3).map((tag) => (
          <View key={tag} style={styles.tagChip}>
            <Text style={styles.tagChipText}>{tag}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  if (status === 'loading' || status === 'idle') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#111827" />
        <Text style={styles.heading}>Cargando perfumes...</Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.center}>
        <Text style={styles.heading}>No se pudieron cargar perfumes</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Buscar por nombre o marca"
          value={search}
          onChangeText={setSearch}
          style={styles.input}
          autoCorrect={false}
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View style={styles.filtersRow}>
        <FlatList
          data={quickFilters}
          horizontal
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            const selected = selectedFilters.includes(item);
            return (
              <TouchableOpacity
                onPress={() => toggleFilter(item)}
                style={[styles.filterChip, selected && styles.filterChipSelected]}
              >
                <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{item}</Text>
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
          contentContainerStyle={{ paddingHorizontal: 8 }}
        />
      </View>

      <Animated.View style={{ flex: 1, opacity: fade, transform: [{ translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
        <FlatList
          data={filteredPerfumes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={NUM_COLUMNS}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
  },
  errorText: {
    color: '#ef4444',
  },
  searchBar: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  input: {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 14,
  },
  filtersRow: {
    paddingVertical: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
  },
  filterChipSelected: {
    backgroundColor: '#111827',
  },
  filterText: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  filterTextSelected: {
    color: '#fff',
  },
  gridContent: {
    paddingHorizontal: CARD_PADDING,
    paddingBottom: 16,
    gap: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: CARD_WIDTH,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  cardRating: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '700',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
  },
  tagChipText: {
    fontSize: 11,
    color: '#111827',
  },
});

export default ExploreScreen;
