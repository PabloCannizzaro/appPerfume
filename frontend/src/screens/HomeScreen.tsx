// Swipe-first home screen for perfume discovery.
import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, TabParamList } from '../navigation/types';
import { Perfume } from '../types/domain';
import { mockPerfumes } from '../data/mockPerfumes';

type HomeNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DISTANCE = SCREEN_WIDTH * 1.2;
const REPEAT_EVERY = 4;

const accentColors = ['#dbeafe', '#fef3c7', '#dcfce7'];

type Decision = 'like' | 'dislike';

const SwipeCard: React.FC<{
  perfume: Perfume;
  backgroundColor: string;
  onPressDetails: () => void;
}> = ({ perfume, backgroundColor, onPressDetails }) => {
  return (
    <View style={styles.card}>
      <View style={[styles.imagePlaceholder, { backgroundColor }]} />
      <Text style={styles.title}>{perfume.name}</Text>
      <Text style={styles.subtitle}>{perfume.brand}</Text>

      <View style={styles.tagsRow}>
        {perfume.tags?.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.summary}>{perfume.summary ?? 'Descripcion pendiente.'}</Text>

      <TouchableOpacity style={styles.detailButton} onPress={onPressDetails}>
        <Text style={styles.detailButtonText}>Ver detalles</Text>
      </TouchableOpacity>
    </View>
  );
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavProp>();
  const position = useRef(new Animated.ValueXY()).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [seenIds, setSeenIds] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<Record<string, Decision>>({});

  const currentPerfume = mockPerfumes[currentIndex];
  const likeCount = useMemo(
    () => Object.values(preferences).filter((value) => value === 'like').length,
    [preferences],
  );
  const dislikeCount = useMemo(
    () => Object.values(preferences).filter((value) => value === 'dislike').length,
    [preferences],
  );

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ['-10deg', '0deg', '10deg'],
  });

  const cardStyle = {
    transform: [...position.getTranslateTransform(), { rotate }],
  };

  const pickNextIndex = (current: number, updatedSeen: string[]) => {
    if (mockPerfumes.length === 0) return current;
    if (updatedSeen.length > 0 && updatedSeen.length % REPEAT_EVERY === 0) {
      const previousIds = updatedSeen.slice(0, -1);
      const candidateId = previousIds[Math.floor(Math.random() * previousIds.length)];
      const candidateIndex = mockPerfumes.findIndex((item) => item.id === candidateId);
      if (candidateIndex >= 0) return candidateIndex;
    }
    return (current + 1) % mockPerfumes.length;
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
    }).start();
  };

  const completeSwipe = (decision: Decision) => {
    if (!currentPerfume) return;

    setPreferences((prev) => ({
      ...prev,
      [currentPerfume.id]: decision,
    }));

    // TODO: Call backend API to persist preference
    // await api.savePreference({ perfumeId: currentPerfume.id, decision });

    const updatedSeen = [...seenIds, currentPerfume.id];
    setSeenIds(updatedSeen);
    const nextIndex = pickNextIndex(currentIndex, updatedSeen);
    setCurrentIndex(nextIndex);
    position.setValue({ x: 0, y: 0 });
  };

  const forceSwipe = (direction: 'left' | 'right') => {
    const x = direction === 'right' ? SWIPE_OUT_DISTANCE : -SWIPE_OUT_DISTANCE;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 220,
      useNativeDriver: true,
    }).start(() => completeSwipe(direction === 'right' ? 'like' : 'dislike'));
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_evt, gesture) => Math.abs(gesture.dx) > 5,
        onPanResponderMove: Animated.event([null, { dx: position.x, dy: position.y }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (_evt, gesture) => {
          if (gesture.dx > SWIPE_THRESHOLD) {
            forceSwipe('right');
          } else if (gesture.dx < -SWIPE_THRESHOLD) {
            forceSwipe('left');
          } else {
            resetPosition();
          }
        },
      }),
    [position, currentIndex],
  );

  const handleOpenSettings = () => navigation.navigate('Settings');
  const handleOpenProfile = () => navigation.navigate('Profile');
  const handleShowDetails = () => {
    if (currentPerfume) {
      navigation.navigate('PerfumeDetail', { perfumeId: currentPerfume.id });
    }
  };

  if (!currentPerfume) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.heading}>No hay perfumes para mostrar</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconButton} onPress={handleOpenSettings} accessibilityLabel="Abrir ajustes">
          <Text style={styles.iconText}>S</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.avatar} onPress={handleOpenProfile} accessibilityLabel="Abrir perfil">
          <Text style={styles.avatarText}>P</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.swipeZone}>
        <Animated.View style={[styles.cardWrapper, cardStyle]} {...panResponder.panHandlers}>
          <SwipeCard
            perfume={currentPerfume}
            backgroundColor={accentColors[currentIndex % accentColors.length]}
            onPressDetails={handleShowDetails}
          />
        </Animated.View>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>Vistos: {seenIds.length}</Text>
        <Text style={styles.metaText}>Likes: {likeCount}</Text>
        <Text style={styles.metaText}>Dislikes: {dislikeCount}</Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={[styles.actionButton, styles.dislikeButton]} onPress={() => completeSwipe('dislike')}>
          <Text style={styles.actionText}>No me gusta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.likeButton]} onPress={() => completeSwipe('like')}>
          <Text style={styles.actionText}>Me gusta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e7eb',
  },
  iconText: {
    fontSize: 14,
    fontWeight: '700',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d1fae5',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
  },
  swipeZone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrapper: {
    width: '100%',
  },
  card: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    gap: 8,
  },
  imagePlaceholder: {
    height: 200,
    borderRadius: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#0ea5e9',
  },
  summary: {
    fontSize: 14,
    color: '#374151',
  },
  detailButton: {
    marginTop: 4,
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#111827',
  },
  detailButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  likeButton: {
    backgroundColor: '#22c55e',
  },
  dislikeButton: {
    backgroundColor: '#ef4444',
  },
  actionText: {
    color: '#fff',
    fontWeight: '700',
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
});

export default HomeScreen;
